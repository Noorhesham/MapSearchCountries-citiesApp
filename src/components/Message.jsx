import styles from "./Message.module.css";

function Message({ message,type }) {
  return (
    <p className={`${styles.message} ${type==='red'?styles.messageRed:''}`}>
      <span role="img">👋</span> {message}
    </p>
  );
}

export default Message;
