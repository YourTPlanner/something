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
exports.uploadWebhook = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
const supabase_1 = require("../../lib/supabase");
const uploadWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const body = req.body;
        console.log('webhook recived');
        const sessionId = (_c = (_b = (_a = body === null || body === void 0 ? void 0 : body.context) === null || _a === void 0 ? void 0 : _a.custom) === null || _b === void 0 ? void 0 : _b.metadata) === null || _c === void 0 ? void 0 : _c.split("=")[1];
        const fileUrl = body === null || body === void 0 ? void 0 : body.secure_url;
        const publicId = body === null || body === void 0 ? void 0 : body.public_id;
        const todoId = (_e = (_d = body === null || body === void 0 ? void 0 : body.context) === null || _d === void 0 ? void 0 : _d.custom) === null || _e === void 0 ? void 0 : _e.todoId;
        //console.log(body)
        if (!sessionId || !todoId)
            //return new Response("Missing sessionId or todoId", { status: 400 });
            return (0, apiResponse_1.apiErrorResponse)({ res, success: false, message: "Missing sessionId or todoId", statusCode: 200 });
        // Append the uploaded file info to corresponding todo.uploads array
        const { data: todo } = yield supabase_1.supabase
            .from("todos")
            .select("uploads")
            .eq("todo_id", todoId)
            .single();
        const uploads = (todo === null || todo === void 0 ? void 0 : todo.uploads) || [];
        uploads.push({ public_id: publicId, url: fileUrl });
        yield supabase_1.supabase
            .from("todos")
            .update({ uploads: uploads })
            .eq("todo_id", todoId);
        (0, apiResponse_1.apiResponse)({
            res,
            success: true,
            message: "Webhook received successfully.",
            statusCode: 200,
            data: body
        });
    }
    catch (error) {
        console.log(error);
        (0, apiResponse_1.apiErrorResponse)({ res, success: false, message: "An error occurred while processing the webhook.", statusCode: 200, reason: error });
    }
});
exports.uploadWebhook = uploadWebhook;
