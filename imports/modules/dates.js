import moment from 'moment';

export const isoTimestamp = () => moment.utc().format();

export const hoursInFuture = (hours) => moment.utc().add(hours, 'hours').format();

export const daysInFuture = (days) => moment.utc().add(days, 'days').format();