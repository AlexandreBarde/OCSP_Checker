const date = require('../src/date')
const moment = require('moment')

describe('Date module', () => {
    let update = '2018-01-17T22:00:00.000Z'
    describe('fonction isDate', () => {
        it('should not be a date', () => {
            let not_a_date = 'NO_OCSP'
            expect(date.isDate(not_a_date)).toBeFalsy()
        })
        it('should be a date', () => {
            let a_date = '2018-01-17T22:38:11.097Z'
            expect(date.isDate(a_date)).toBeTruthy()
        })
    })
    describe('function ocspAge', () => {
        it('should be 60000 ms', () => {
            let current_date = new Date('2018-01-17T22:01:00.000Z')
            expect(date.ocspAge(update, current_date)).toEqual(60000)
        })
    })
    describe('function timeDiff', () => {
        it('should be 0 ms', () => {
            expect(date.timeDiff(1000, 1000)).toBe(0)
        })
        it('should be 1000', () => {
            expect(date.timeDiff(2000, 1000)).toBe(1000)
        })
        it('should be -1000', () => {
            expect(date.timeDiff(1000, 2000)).toBe(-1000)
        })
    })
    describe('function formatDuration', () => {
        let sec_ms = 1000
        let minute_ms = sec_ms * 60
        let hour_ms = minute_ms * 60
        let day_ms = hour_ms * 24

        it('should be 1 jour', () => {
            expect(date.formatDuration(day_ms)).toBe('1 jour')
        })
        it('should be 00:00:00', () => {
            expect(date.formatDuration(0)).toBe('00:00:00')
        })
        it('should be 00:00:01', () => {
            expect(date.formatDuration(sec_ms)).toBe('00:00:01')
        })
        it('should be 00:01:00', () => {
            expect(date.formatDuration(minute_ms)).toBe('00:01:00')
        })
        it('should be 01:00:00', () => {
            expect(date.formatDuration(hour_ms)).toBe('01:00:00')
        })
        it('should be 3 jours', () => {
            expect(date.formatDuration(day_ms * 3)).toBe('3 jours')
        })
        it('should be 2 jours 02:00:00', () => {
            expect(date.formatDuration(day_ms * 2 + hour_ms * 2)).toBe('2 jours 02:00:00')
        })
        it('should be 2 jours 01:02:03', () => {
            let dur = 2 * day_ms + hour_ms + 2 * minute_ms + 3 * sec_ms
            expect(date.formatDuration(dur)).toBe('2 jours 01:02:03')
        })
    })
})

