import { Request, Response } from "express";
import { apiErrorResponse, apiResponse } from "../../utils/apiResponse";
import { v4 } from "uuid";
import { supabase } from "../../lib/supabase";

export const createTodo = async (req : Request, res : Response) => {
    try {
        const { id, title } = await req.body; 

        const sessionId = `sess_${v4()}`;

        const { data, status } = await supabase
            .from("todos")
            .insert({ title: title, todo_id : id, session_id: sessionId, uploads: [] })
            .select()
            .single();

        if(status !== 201) {
            return apiErrorResponse({ res, success : false, message : "Failed to create todo.", statusCode: 200 });
        }

        apiResponse({
            res,
            success : true,
            message : "todos received successfully.",
            statusCode: 200,
            data: { sessionId }
        });
    }
    catch (error) {
        console.log(error);
        apiErrorResponse({ res, success : false, message : "An error occurred while processing the webhook.", statusCode: 200, reason: error });
    }
}
