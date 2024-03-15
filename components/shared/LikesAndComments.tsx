"use client";

import React from "react";

interface Props {
  likesCount: number;
  commentsCount: number;
}

function LikesAndComments({ likesCount, commentsCount }: Props) {
  const likesText =
    likesCount > 0 ? `${likesCount} like${likesCount !== 1 ? "s" : ""}` : "";
  const commentsText =
    commentsCount > 0
      ? `${commentsCount} repl${commentsCount !== 1 ? "ies" : "y"}`
      : "";

  const displayText =
    likesText && commentsText
      ? `${likesText} - ${commentsText}`
      : likesText || commentsText;

  if (likesCount === 0 && commentsCount === 0) return null;

  return <p className="mt-1 text-subtle-medium text-gray-1">{displayText}</p>;
}

export default LikesAndComments;
