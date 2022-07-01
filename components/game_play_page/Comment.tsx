import { db } from "../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { ReactNode, useState } from "react";

const Comment = ({ collectionName }: { collectionName: string }) => {
  const [name, setName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<ReactNode[]>([]);
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const handleSubmit = async () => {
    try {
      if (
        name.length > 30 ||
        newComment.length > 300 ||
        name.length < 1 ||
        newComment.length < 1
      ) {
        throw new Error(
          "名前は1～30文字、コメントは1～300文字で入力してください"
        );
      }
      const docRef = await addDoc(collection(db, collectionName), {
        name: name,
        comment: newComment,
        timeStamp: new Date(),
      });
    } catch (e: any) {
      alert(e.message);
    }
  };
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.currentTarget.value);
  };

  const handleCommentButtonClick = () => {
    setCommentIsOpen(!commentIsOpen);
    fetchComments();
  };

  const fetchComments = async () => {
    const q = query(
      collection(db, collectionName),
      orderBy("timeStamp", "desc")
    );
    const histories = await getDocs(q);
    const historyNodes: ReactNode[] = [];
    histories.forEach((doc) => {
      historyNodes.push(
        <li key={doc.data().date}>
          <h3 style={{ borderTop: "dashed #000000" }} className="font-bold">
            {doc.data().name}
          </h3>
          <p>{doc.data().comment}</p>
        </li>
      );
    });
    setComments(historyNodes);
  };

  return (
    <div>
      <button
        style={{ border: "4px double #0090bb", margin: "2% 2% 1% 2%" }}
        className="text-xl bg-white px-2 py-2"
        onClick={handleCommentButtonClick}
      >
        {commentIsOpen ? "コメントを非表示にする" : "コメントを表示する"}
      </button>
      {commentIsOpen && (
        <form style={{ margin: "0 2%" }} className="flex flex-col w-52">
          <label>名前</label>
          <input
            name="name"
            type="text"
            onChange={(e) => {
              handleChangeName(e);
            }}
          />
          <label>コメント</label>
          <textarea
            name="comment"
            onChange={(e) => {
              handleChangeComment(e);
            }}
          />
        </form>
      )}
      {commentIsOpen && (
        <button
          className="text-lg font-bold px-2 bg-blue text-white"
          style={{ border: "8px double #0090bb", margin: "1% 2%" }}
          onClick={() => {
            handleSubmit().then(() => {
              fetchComments();
            });
          }}
        >
          送信
        </button>
      )}
      {commentIsOpen && (
        <ul
          className="bg-white shadow-md rounded px-5 py-5"
          style={{ borderTop: "double 5px #dafec7", margin: "2% 2%" }}
        >
          <h2 className="text-2xl font-bold" style={{ marginBottom: "1%" }}>
            コメント一覧
          </h2>
          {comments}
        </ul>
      )}
    </div>
  );
};

export default Comment;
