-- Q&A and Discussion Tables for Nursing Hub
-- Run this in your Supabase SQL editor

-- Questions table (for general Q&A board)
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answers/replies to questions
CREATE TABLE answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  clerk_user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT false,
  is_from_lauren BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource comments (for discussions on each guide)
CREATE TABLE resource_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_slug VARCHAR(100) NOT NULL,
  clerk_user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  parent_id UUID REFERENCES resource_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_questions_created ON questions(created_at DESC);
CREATE INDEX idx_questions_answered ON questions(is_answered, created_at DESC);
CREATE INDEX idx_answers_question ON answers(question_id, created_at);
CREATE INDEX idx_resource_comments_slug ON resource_comments(resource_slug, created_at);
CREATE INDEX idx_resource_comments_parent ON resource_comments(parent_id);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_comments ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can read, authenticated users can insert their own
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view answers" ON answers FOR SELECT USING (true);
CREATE POLICY "Anyone can view comments" ON resource_comments FOR SELECT USING (true);

CREATE POLICY "Users can insert own questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can insert own answers" ON answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can insert own comments" ON resource_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own questions" ON questions FOR UPDATE USING (true);
CREATE POLICY "Users can delete own questions" ON questions FOR DELETE USING (true);
