#include <node.h>
#include <node_buffer.h>
#include <v8.h>

using namespace v8;

Handle<Value> Run(const Arguments& args) {
	HandleScope scope;

	if (args.Length() != 1) {
		ThrowException(Exception::TypeError(String::New("Wrong number of arguments, expected 1")));
		return scope.Close(Undefined());
	}

	if (!args[0]->IsObject()) {
		ThrowException(Exception::TypeError(String::New("First argument must be an object")));
		return scope.Close(Undefined());
	}

	Handle<Object> object = Handle<Object>::Cast(args[0]);

	// increment the count
	Handle<String> field_name = String::New("count");
	Handle<Value> count = object->Get(field_name);
	Handle<Number> field_value = Number::New(count->NumberValue() + 1);
	object->Set(field_name, field_value);

	// call the log function
	Handle<Value> log_func = object->Get(String::New("log"));
	if (log_func->IsFunction()) {
		Handle<Function> f = Handle<Function>::Cast(log_func);
		int argcount = 0;
		Handle<Value> * argarray = NULL;
		Handle<Value> result = f->Call(object, argcount, argarray);
	}

	return scope.Close(Undefined());
}

void init(Handle<Object> target) {
	target->Set(String::NewSymbol("run"),
			FunctionTemplate::New(Run)->GetFunction());
}

NODE_MODULE(bt, init)

