#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include <errno.h>
#include <sys/ioctl.h>
#include <linux/joystick.h>

using namespace v8;

/* Three similar functions for getting respectively the number of buttons, axes and the name
 * of a joystick connected through USB. 
 */

Handle<Value> GetNumberOfButtons(const Arguments& args) {
	HandleScope scope;

	if (args.Length() != 2 || !args[0]->IsNumber() || !args[1]->IsObject()) {
		ThrowException(Exception::TypeError(String::New("Invalid parameters, expected (number, object)")));
		return scope.Close(Undefined());
	}

	// make ioctl call 
	int fd = args[0]->IntegerValue();
	unsigned int op = JSIOCGBUTTONS;
	int buffer = 0;
	int success = ioctl(fd, op, &buffer);


	// set object field
	Local<Object> object = Local<Object>::Cast(args[1]);
	object->Set(String::NewSymbol("buttons"), Number::New(buffer));

	// return ioctl code
	return scope.Close(Number::New(success));
}

Handle<Value> GetNumberOfAxes(const Arguments& args) {
	HandleScope scope;

	if (args.Length() != 2 || !args[0]->IsNumber() || !args[1]->IsObject()) {
		ThrowException(Exception::TypeError(String::New("Invalid parameters, expected (number, object)")));
		return scope.Close(Undefined());
	}

	// make ioctl call 
	int fd = args[0]->IntegerValue();
	unsigned int op = JSIOCGAXES;
	int buffer = 0;
	int success = ioctl(fd, op, &buffer);

	// set object field
	Local<Object> object = Local<Object>::Cast(args[1]);
	object->Set(String::NewSymbol("axes"), Number::New(buffer));

	// return ioctl code
	return scope.Close(Number::New(success));
}

Handle<Value> GetJoystickName(const Arguments& args) {
	HandleScope scope;

	if (args.Length() != 2 || !args[0]->IsNumber() || !args[1]->IsObject()) {
		ThrowException(Exception::TypeError(String::New("Invalid parameters, expected (number, object)")));
		return scope.Close(Undefined());
	}

	// make ioctl call 
	int fd = args[0]->IntegerValue();
	unsigned int op = JSIOCGNAME(1024);
	char * buffer = new char[1024];
	int num_read = ioctl(fd, op, buffer);

	// set object field
	Local<Object> object = Local<Object>::Cast(args[1]);
	object->Set(String::NewSymbol("name"), String::New(buffer, num_read));

	// deallocate buffer
	delete buffer;

	// return ioctl code
	return scope.Close(Number::New(num_read));
}

void init(Handle<Object> target) {
	target->Set(String::NewSymbol("buttons"), FunctionTemplate::New(GetNumberOfButtons)->GetFunction());
	target->Set(String::NewSymbol("axes"), FunctionTemplate::New(GetNumberOfAxes)->GetFunction());
	target->Set(String::NewSymbol("name"), FunctionTemplate::New(GetJoystickName)->GetFunction());
}

NODE_MODULE(joystick, init)
