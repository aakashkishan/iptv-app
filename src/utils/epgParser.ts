import { EPGProgram } from '../types';
import { XMLParser } from 'fast-xml-parser';

export async function parseEPG(xmlContent: string): Promise<EPGProgram[]> {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    
    const result = parser.parse(xmlContent);
    const programs: EPGProgram[] = [];
    
    if (!result.tv || !result.tv.programme) {
      return programs;
    }
    
    const programmeList = Array.isArray(result.tv.programme) 
      ? result.tv.programme 
      : [result.tv.programme];
    
    for (const prog of programmeList) {
      const startDate = parseXMLTVDate(prog['@_start']);
      const stopDate = parseXMLTVDate(prog['@_stop']);
      
      programs.push({
        channel: prog['@_channel'] || '',
        start: startDate,
        stop: stopDate,
        title: typeof prog.title === 'string' ? prog.title : prog.title?.[0] || '',
        description: typeof prog.desc === 'string' ? prog.desc : prog.desc?.[0] || '',
        category: typeof prog.category === 'string' ? prog.category : prog.category?.[0] || '',
      });
    }
    
    return programs;
  } catch (error) {
    console.error('Error parsing EPG data:', error);
    return [];
  }
}

function parseXMLTVDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  // XMLTV format: YYYYMMDDHHmmSS +HHMM or YYYYMMDDHHmmSS
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(8, 10);
  const minute = dateStr.substring(10, 12);
  const second = dateStr.substring(12, 14);
  
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
}

export async function fetchEPG(url: string): Promise<EPGProgram[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch EPG: ${response.statusText}`);
    }
    const content = await response.text();
    return parseEPG(content);
  } catch (error) {
    throw error;
  }
}

export function getCurrentProgram(programs: EPGProgram[], channelId: string): EPGProgram | null {
  const now = new Date();
  
  return programs.find(program => 
    program.channel === channelId &&
    program.start <= now &&
    program.stop >= now
  ) || null;
}

export function getUpcomingPrograms(programs: EPGProgram[], channelId: string, count: number = 5): EPGProgram[] {
  const now = new Date();
  
  return programs
    .filter(program => 
      program.channel === channelId &&
      program.start >= now
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, count);
}
