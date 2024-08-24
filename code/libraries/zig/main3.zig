const qjs = @import("quickjs.zig");
const std = @import("std");
const c = @cImport({
    @cInclude("string.h");
});

fn eval(buf: [*c]const u8, size: usize) [*c]const u8 {
    const runtime = qjs.JS_NewRuntime();
    defer qjs.JS_FreeRuntime(runtime);
    const context = qjs.JS_NewContext(runtime);
    defer qjs.JS_FreeContext(context);

    const ret = qjs.JS_Eval(context, buf, size, "main", qjs.JS_EVAL_TYPE_GLOBAL);
    if (qjs.JS_IsException(ret) != 0) {
        const exception = qjs.JS_GetException(context);
        defer qjs.JS_FreeValue(context, exception);
        return qjs.JS_ToCString(context, exception);
    }

    return qjs.JS_ToCString(context, ret);
}

fn zig_eval(buf: []const u8) []const u8 {
    const ret = eval(buf.ptr, buf.len);
    if (ret == null) return "";
    return ret[0..c.strlen(ret)];
}

pub fn main() anyerror!void {
    const n = zig_eval("1 + 2*100");
    std.debug.print("sum: {s}\n", .{n});
}
