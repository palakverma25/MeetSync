import { formatEventDateTime } from "@/lib/formatDate";

type Props = {
  date: Date;
  venue: string;
  className?: string;
};

/** Shared line to tell events apart when titles repeat: date · venue */
export function EventSubtitle({ date, venue, className = "" }: Props) {
  return (
    <p className={className}>
      <time dateTime={date.toISOString()}>{formatEventDateTime(date)}</time>
      <span aria-hidden> · </span>
      <span>{venue}</span>
    </p>
  );
}
