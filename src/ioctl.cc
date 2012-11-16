#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include <sys/ioctl.h>

using namespace v8;

Handle<Value> Method(const Arguments& args) {
	HandleScope scope;

	if (args.Length() != 3) {
		ThrowException(Exception::TypeError(String::New("Wrong number of arguments, expected 3")));
		return scope.Close(Undefined());
	}

	Local<Value> fd(args[0]); // file descriptor
	Local<Value> op(args[1]); // operation
	Handle<Value> buf(args[2]); // buffer

	if (!fd->IsNumber()) {
		ThrowException(Exception::TypeError(String::New("First argument must be file descriptor")));
		return scope.Close(Undefined());
	}

	if (!op->IsNumber()) {
		ThrowException(Exception::TypeError(String::New("Second argument must be ioctl operation")));
		return scope.Close(Undefined());
	}

	if (!buf->IsObject()) {
		ThrowException(Exception::TypeError(String::New("Third argument must be a buffer")));
		return scope.Close(Undefined());
	}

	void * raw_buf = (void *) node::Buffer::Data(buf->ToObject());

	int success = ioctl(fd->NumberValue(), op->NumberValue(), raw_buf);

	return scope.Close(Number::New(success));
}

void init(Handle<Object> target) {
	target->Set(String::NewSymbol("ioctl"),
			FunctionTemplate::New(Method)->GetFunction());
}

NODE_MODULE(ioctl, init)

