import { useParams } from "react-router-dom";
import Chat from "./Chat";

export default function ChatPage() {
  const { receiverId } = useParams();
  return <Chat receiverId={receiverId} />;
}
