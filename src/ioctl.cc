#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include <sys/ioctl.h>
#include <errno.h>

using namespace v8;

Handle<Value> Method(const Arguments& args) {
	HandleScope scope;

	if (args.Length() != 3) {
		ThrowException(Exception::TypeError(String::New("Wrong number of arguments, expected 3")));
		return scope.Close(Undefined());
	}

	if (!args[0]->IsNumber()) {
		ThrowException(Exception::TypeError(String::New("First argument must be file descriptor")));
		return scope.Close(Undefined());
	}

	if (!args[1]->IsNumber()) {
		ThrowException(Exception::TypeError(String::New("Second argument must be ioctl operation")));
		return scope.Close(Undefined());
	}

	if (!node::Buffer::HasInstance(args[2])) {
		ThrowException(Exception::TypeError(String::New("Third argument must be a buffer")));
		return scope.Close(Undefined());
	}

	int file_descriptor = args[0]->IntegerValue();
	unsigned int operation = args[1]->IntegerValue();
	Local<Object> buffer = Local<Object>::Cast(args[2]);
	void * raw_buffer = static_cast<void *>(node::Buffer::Data(buffer));

	int success = ioctl(file_descriptor, operation, static_cast<char *>(raw_buffer));

	if(success == -1) {
		int errsv = errno;
		Local<String> error_message;
		switch(errsv) {
			case EBADF: error_message = String::New("EBADF bad file descriptor"); break;
			case EFAULT: error_message = String::New("EFAULT argp references an inaccessible memory area"); break;
			case ENOTTY: error_message = String::New("ENOTTY file descriptor is not associate with a character special device or specified request does not apply to the kind of object that the descriptor d references"); break;
			case EINVAL: error_message = String::New("EINVAL operation or buffer invalid"); break;
		}
		ThrowException(Exception::Error(error_message));
		return scope.Close(Undefined());
	}

	return scope.Close(Number::New(success));
}

void init(Handle<Object> target) {
	target->Set(String::NewSymbol("ioctl"),
			FunctionTemplate::New(Method)->GetFunction());
}

NODE_MODULE(ioctl, init)
