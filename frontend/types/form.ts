export type FormStatus = "draft" | "published"

export type QuestionType = 
    | "short_text"
    | "long_text"
    | "multiple_choice"
    | "email"
    | "dropdown"
    | "number"
    | "yes_no"
    | "rating";

export interface QuestionOption {
    id: String,
    label: String,
    value: String,
    order: number,
}

export interface Question {
    id: String;
    type: QuestionType;

    title: String;
    description?: String;

    required: boolean;

    placeholder?: String;

    order: number;

    options?: QuestionOption[];
}


export interface Form {
    id: String;
    
    title: String;
    description?: String;

    status: FormStatus;
    

    questions: Question[];

    createdAt: String;
    updatedAt: String;
}