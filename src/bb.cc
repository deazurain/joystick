#include <node.h>
#include <node_buffer.h>
#include <v8.h>

using namespace v8;

Handle<Value> Fill(const Arguments& args) {
	HandleScope scope;

	if (args.Length() != 2) {
		ThrowException(Exception::TypeError(String::New("Wrong number of arguments, expected 2")));
		return scope.Close(Undefined());
	}

	if (!node::Buffer::HasInstance(args[0])) {
		ThrowException(Exception::TypeError(String::New("First argument must be a buffer")));
		return scope.Close(Undefined());
	}

	if (!args[1]->IsNumber()) {
		ThrowException(Exception::TypeError(String::New("Second argument must be a number")));
		return scope.Close(Undefined());
	}

	Handle<Object> buffer = Handle<Object>::Cast(args[0]);
	int fill_value = args[1]->NumberValue();
	size_t length = node::Buffer::Length(buffer);
	void * data = static_cast<void *>(node::Buffer::Data(buffer));

	memset(data, fill_value, length);

	return scope.Close(Undefined());
}

void init(Handle<Object> target) {
	target->Set(String::NewSymbol("fill"),
			FunctionTemplate::New(Fill)->GetFunction());
}

NODE_MODULE(bb, init)

