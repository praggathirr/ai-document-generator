# Document Generation System

## Overview

This application is an AI-driven document generation system designed to streamline the creation of quality management plans for projects. It leverages user inputs and GPT-based AI to generate structured and comprehensive documents tailored to specific project needs.

## Features

- **User Authentication**: 
  - Create an account with a unique username.
  - Log in with an existing account.

- **Project Overview**:
  - Enter and save a high-level project overview.
  - Edit and update the overview anytime.

- **High-Level Topics Selection**:
  - Select from 28 predefined high-level topics crucial to quality management.
  - Save and revisit selected topics.

- **Subtopic Questions**:
  - Provide detailed responses to subtopic questions for each selected topic.
  - Save responses and view previously entered answers on revisit.

- **AI-Generated Document**:
  - Use GPT to generate a quality management document based on user inputs.
  - Save the generated document in the database for future reference.

- **Seamless Navigation**:
  - Navigate through topics, subtopics, and project overview with ease.
  - Modify inputs and regenerate the document as needed.

## Tech Stack

### Frontend:
- **React**: For building the user interface.
- **React Router**: For seamless page navigation.
- **React Markdown**: To render formatted text like bold, lists, and headings.

### Backend:
- **Node.js**: For the server-side logic.
- **Express**: For building RESTful APIs.
- **SQLite**: For persistent database storage.
- **OpenAI API**: For generating quality management plans using GPT.

