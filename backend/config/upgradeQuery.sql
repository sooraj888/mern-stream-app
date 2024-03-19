
--update Query's 

CREATE TABLE IF NOT EXISTS content (
    "videoId" SERIAL PRIMARY KEY UNIQUE,
    "title" VARCHAR(400) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "videoTime" NUMERIC NOT NULL,
    "likes" NUMERIC DEFAULT 0,
    "dislikes" NUMERIC DEFAULT 0,
    "videoMetaData" JSONB NOT NULL,
    "totalViews" NUMERIC DEFAULT 0,
    "createdUserId" integer NOT NULL,
    FOREIGN KEY ("createdUserId") REFERENCES users ("userId")
);


CREATE TABLE IF NOT EXISTS comments (
    "commentId" SERIAL PRIMARY KEY UNIQUE,
    "commentUserId" integer NOT NULL,
    "commentMessage" TEXT NOT NULL,
    "commentVideoId" integer NOT NULL,
    FOREIGN KEY ("commentUserId") REFERENCES users ("userId"),
    FOREIGN KEY ("commentVideoId") REFERENCES content ("videoId")
)
