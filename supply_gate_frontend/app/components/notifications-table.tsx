import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

const notifications = [
  { id: 1, email: "ruta@gmail.com", message: "message 1", date: "04/7/2025" },
  { id: 2, email: "peace@gmail.com", message: "message 2", date: "11/7/2025" },
  {
    id: 3,
    email: "colombe@gmail.com",
    message: "message 3",
    date: "12/7/2025",
  },
  {
    id: 4,
    email: "vaillante@gmail.com",
    message: "message 4",
    date: "18/7/2025",
  },
];

export function NotificationsTable() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border text-gray-700">
      <h3 className="font-semibold mb-4 text-gray-700">Notification Details</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Notification Id</TableHead>
            <TableHead>user name</TableHead>
            <TableHead>message</TableHead>
            <TableHead>date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>{notification.id}</TableCell>
              <TableCell>{notification.email}</TableCell>
              <TableCell>{notification.message}</TableCell>
              <TableCell className="text-gray-700">
                {notification.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
