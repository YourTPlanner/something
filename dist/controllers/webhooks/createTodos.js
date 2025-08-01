"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodo = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
const uuid_1 = require("uuid");
const supabase_1 = require("../../lib/supabase");
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title } = yield req.body;
        const sessionId = `sess_${(0, uuid_1.v4)()}`;
        const { data, status } = yield supabase_1.supabase
            .from("todos")
            .insert({ title: title, todo_id: id, session_id: sessionId, uploads: [] })
            .select()
            .single();
        if (status !== 201) {
            return (0, apiResponse_1.apiErrorResponse)({ res, success: false, message: "Failed to create todo.", statusCode: 200 });
        }
        (0, apiResponse_1.apiResponse)({
            res,
            success: true,
            message: "todos received successfully.",
            statusCode: 200,
            data: { sessionId }
        });
    }
    catch (error) {
        console.log(error);
        (0, apiResponse_1.apiErrorResponse)({ res, success: false, message: "An error occurred while processing the webhook.", statusCode: 200, reason: error });
    }
});
exports.createTodo = createTodo;
