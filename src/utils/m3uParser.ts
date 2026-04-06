import { Channel } from '../types';

export function parseM3U(content: string): Channel[] {
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  const channels: Channel[] = [];
  
  let currentChannel: Partial<Channel> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      currentChannel = parseExtInf(line);
    } else if (line.startsWith('#')) {
      // Skip other comments
      continue;
    } else if (line.startsWith('http') || line.startsWith('/')) {
      // This is the URL line
      if (currentChannel.name) {
        channels.push({
          id: currentChannel.tvgId || `channel-${channels.length}`,
          name: currentChannel.name || 'Unknown Channel',
          url: line,
          logo: currentChannel.logo || '',
          group: currentChannel.group || 'Uncategorized',
          tvgId: currentChannel.tvgId || '',
          tvgName: currentChannel.tvgName || '',
          language: currentChannel.language || '',
          country: currentChannel.country || '',
        });
      }
      currentChannel = {};
    }
  }
  
  return channels;
}

function parseExtInf(line: string): Partial<Channel> {
  const channel: Partial<Channel> = {};
  
  // Extract display name (after the last comma)
  const nameMatch = line.match(/,(.+)$/);
  if (nameMatch) {
    channel.name = nameMatch[1].trim();
  }
  
  // Extract tvg-logo
  const logoMatch = line.match(/tvg-logo="([^"]*)"/);
  if (logoMatch) {
    channel.logo = logoMatch[1];
  }
  
  // Extract tvg-id
  const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
  if (tvgIdMatch) {
    channel.tvgId = tvgIdMatch[1];
  }
  
  // Extract tvg-name
  const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
  if (tvgNameMatch) {
    channel.tvgName = tvgNameMatch[1];
  }
  
  // Extract group-title
  const groupMatch = line.match(/group-title="([^"]*)"/);
  if (groupMatch) {
    channel.group = groupMatch[1];
  }
  
  // Extract tvg-language
  const langMatch = line.match(/tvg-language="([^"]*)"/);
  if (langMatch) {
    channel.language = langMatch[1];
  }
  
  // Extract tvg-country
  const countryMatch = line.match(/tvg-country="([^"]*)"/);
  if (countryMatch) {
    channel.country = countryMatch[1];
  }
  
  return channel;
}

export async function fetchPlaylist(url: string): Promise<Channel[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.statusText}`);
    }
    const content = await response.text();
    return parseM3U(content);
  } catch (error) {
    throw error;
  }
}

export function parseM3UFile(file: File): Promise<Channel[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const channels = parseM3U(content);
        resolve(channels);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
