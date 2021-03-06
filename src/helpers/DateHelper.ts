export function format(date: Date, fmt: string) {
  const o: { [key: string]: number } = {
    'y+': date.getFullYear(), // 年份
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    'H+': date.getHours(), // 24小时制
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'f+': date.getMilliseconds() // 毫秒
  };
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, o[k].toString().padStart(RegExp.$1.length, '0'));
    }
  }
  return fmt;
}

export function formatNow(fmt: string) {
  return format(new Date(), fmt);
}

export function formatISO8601(iosDateStr: string, fmt?: string) {
  const dateParts = iosDateStr.match(/\d+/g);
  if (dateParts && dateParts.length >= 5) {
    const isoTime = Date.UTC(+dateParts[0], +dateParts[1] - 1, +dateParts[2], +dateParts[3], +dateParts[4], +dateParts[5]);
    const date = new Date(isoTime);
    if (fmt) {
      return format(date, fmt);
    }
    return date;
  }
  if (fmt) {
    return formatNow(fmt);
  }
  return new Date();
}
