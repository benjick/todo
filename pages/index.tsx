import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef } from "react";
import { useStore, useTodo } from "../src/state";
import styles from "../styles/Home.module.css";

const AddItem: React.FC = () => {
  const { categoriesWithEvents } = useTodo();
  const { addItem } = useStore();
  const nameRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const timerRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = nameRef.current?.value;
    const category = categoryRef.current?.value;
    const timer = timerRef.current ? Number(timerRef.current.value) : undefined;

    if (!name || !category) {
      return;
    }

    addItem({
      category,
      name,
      timerMinutes: timer,
    });
    nameRef.current.value = "";
    // timerRef.current?.value = "";
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add todo</h2>
      <input required ref={nameRef} placeholder="Todo name" />
      <select ref={categoryRef}>
        {categoriesWithEvents.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        step="1"
        ref={timerRef}
        placeholder="Timer action?"
      />
      <button>Create todo</button>
    </form>
  );
};

const AddCategory: React.FC = () => {
  const { categoriesWithEvents } = useTodo();
  const { addCategory } = useStore();
  const nameRef = useRef<HTMLInputElement>(null);
  const resetRef = useRef<HTMLSelectElement>(null);
  const closeAfterFinishedRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = nameRef.current?.value;
    let resetEvery = resetRef.current?.value as
      | "never"
      | "day"
      | "week"
      | undefined;
    const closeAfterFinished = closeAfterFinishedRef.current
      ? Number(closeAfterFinishedRef.current.value)
      : 0;

    if (!name || !resetEvery) {
      return;
    }

    if (!["day", "week", "never"].includes(resetEvery)) {
      resetEvery = "never";
    }

    addCategory({
      name,
      closeAfterFinished,
      resetEvery,
      sort: categoriesWithEvents.length,
    });
    nameRef.current.value = "";
    // timerRef.current?.value = "";
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add category</h2>
      <input required ref={nameRef} placeholder="Todo name" />
      <select ref={resetRef}>
        <option value="never">Never reset tasks</option>
        <option value="day">Reset tasks daily</option>
        <option value="week">Reset tasks weekly</option>
      </select>
      <input
        type="number"
        step="1"
        ref={closeAfterFinishedRef}
        placeholder="Close category after X finished items?"
      />
      <button>Create category</button>
    </form>
  );
};

const Home: NextPage = () => {
  const { categoriesWithEvents, finishTodo, showCompleted, setShowCompleted } =
    useTodo();
  return (
    <div className={styles.container}>
      <Head>
        <title>TODO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <AddItem />

        <AddCategory />

        {showCompleted ? (
          <button onClick={() => setShowCompleted(false)}>
            Hide completed
          </button>
        ) : (
          <button onClick={() => setShowCompleted(true)}>Show completed</button>
        )}
        {categoriesWithEvents.map((category) => (
          <div key={category.id}>
            <p>{category.name}</p>
            {category.items.map((item) => (
              <li key={item.id}>
                {item.name}{" "}
                <button onClick={() => finishTodo(item.id)}>finish</button>
              </li>
            ))}
          </div>
        ))}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
