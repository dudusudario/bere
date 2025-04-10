
import { format as formatDate } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

/**
 * Formata um timestamp para exibição em interface de usuário
 * @param timestamp Data a ser formatada
 * @returns Data formatada no padrão DD/MM/YYYY HH:MM
 */
export function formatDisplayTimestamp(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return formatDate(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (e) {
    return 'Data inválida';
  }
}

/**
 * Formata um timestamp no padrão ISO com timezone
 * @param timestamp Data a ser formatada
 * @returns Data formatada no padrão YYYY-MM-DDThh:mm:ss.SSSXXX
 */
export function formatISOWithTimezone(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    // Obtém o fuso horário local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
  } catch (e) {
    return new Date().toISOString();
  }
}

/**
 * Cria um timestamp no formato ISO com timezone para enviar ao backend
 * @returns Data atual formatada no padrão YYYY-MM-DDThh:mm:ss.SSSXXX
 */
export function getCurrentTimestampWithTimezone(): string {
  return formatISOWithTimezone(new Date());
}
