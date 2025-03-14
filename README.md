# error-express-handler

This package exports a middleware for express that handles Error and HttpError(custom package type).
## Install
```sh
npm install --save @map-colonies/error-express-handler
```

## API documentation
Check the autogenerated documentation [here](https://mapcolonies.github.io/error-express-handler/).

## Usage
Add the handler as the last middleware, so any error forwarded by the controllers will be handled.
If the value of `NODE_ENV` is production the error message will be redacted and a generic one will be sent instead.
In development, in addition to the error message, the stack trace of the error will be included in the response.

```ts
import express from 'express';
import { getErrorHandlerMiddleware } from '@map-colonies/error-express-handler';

process.env.NODE_ENV = 'development';

const app = express();

app.use('/meow', fn);

app.use(getErrorHandlerMiddleware());

app.listen(8080, function() {
    console.log('server is up');
});
```

## Flow
```mermaid
flowchart TD
    A@{ label: "NODE_ENV='production'" } -- true --> B["error implements HttpError"]
    A -- false --> C["error implements HttpError"]
    B -- true --> D["Status code: err.StatusCode<br>body: {ﬂ°°34¶ßmessageﬂ°°34¶ß:ﬂ°°34¶ßerr.messageﬂ°°34¶ß}"]
    B -- false --> E["Status code: 500<br>body: {ﬂ°°34¶ßmessageﬂ°°34¶ß:ﬂ°°34¶ßInternal Server Errorﬂ°°34¶ß}"]
    C -- true --> F["Status code: err.StatusCode<br>body: {ﬂ°°34¶ßmessageﬂ°°34¶ß:ﬂ°°34¶ßerr.messageﬂ°°34¶ß}"]
    C -- false --> G["Status code: 500<br>body: {ﬂ°°34¶ßmessageﬂ°°34¶ß:ﬂ°°34¶ßInternal Server Errorﬂ°°34¶ß, ﬂ°°34stacktraceﬂ°°34:err.stack }"]

```
