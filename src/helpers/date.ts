import { parseISO, isValid, addDays, addMinutes } from 'date-fns'

export const isValidDate = (date: string) => {
    if (!date) return false
    const parsedDate = parseISO(date)
    return isValid(parsedDate)
}

export const addDaysToDate = (startDate: Date, daysToAdd: number) => {
    return addDays(startDate, daysToAdd)
}

export const addMinutesToDate = (startDate: Date, MinutesToAdd: number) => {
    return addMinutes(startDate, MinutesToAdd)
}
