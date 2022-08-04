import type { NextPage } from "next";
import getConfig from "next/config";
import { useState } from "react";

const { publicRuntimeConfig } = getConfig();

const ENDPOINT = publicRuntimeConfig.apiHost + "/api/contact/create";

export default function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    const param = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },

      body: JSON.stringify({
        contact_input: {
          name: name,
          email: email,
          body: body,
        },
      }),
    };

    fetch(ENDPOINT, param)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json["success"] < 1) {
          alert(json["error_message"]);
          return;
        } else {
          alert("送信しました。");
        }
      });
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.currentTarget.value);
  };

  return (
    <div className="flex items-center flex-col">
      <p className="font-bold text-3xl mt-4">お問い合わせフォーム</p>
      <p className="text-sm">（意見・感想などもお気軽にどうぞ！）</p>
      <form className="flex-col flex w-52 -ml-52">
        <label className="mt-2">お名前</label>
        <input
          name="name"
          type="text"
          onChange={(e) => {
            handleChangeName(e);
          }}
        />
        <label className="mt-2">メールアドレス</label>
        <input
          name="email"
          onChange={(e) => {
            handleChangeEmail(e);
          }}
        />
        <label className="mt-2">お問い合わせ内容</label>
        <textarea
          name="body"
          onChange={(e) => {
            handleChangeBody(e);
          }}
          className="w-96 h-52"
        />
      </form>
      <button
        className="text-lg font-bold px-2 bg-blue text-white mt-6 w-28"
        style={{ border: "8px double #0090bb" }}
        onClick={handleSubmit}
      >
        送信
      </button>
    </div>
  );
}
