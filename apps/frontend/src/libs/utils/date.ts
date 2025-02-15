export const unixTimeToDate = (time: string) => {
  return new Date(time.length === 10 ? Number(time) * 1000 : Number(time))
}
