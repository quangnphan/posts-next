"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((data) => (
        <PromptCard
          key={data._id}
          post={data}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTimeout,setSearchTimeout] = useState(null);
  const [posts, setPosts] = useState([]);

  const filterPrompts = (text) => {
    const regex = new RegExp(text, "i"); //no caps

    return posts.filter((item) => {
      return (
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
      );
    });
  };

  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(()=>{
        const filteredResult = filterPrompts(e.target.value);
        setFilteredPosts(filteredResult);
      }, 500)
    )
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);

    const result = filterPrompts(tag);
    setFilteredPosts(result); 
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/prompt");
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearch}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
