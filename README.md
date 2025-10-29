# Audio-Calm-Backend
### This project is a Backend, cloud-native solution for uploading and managing audio files categorized by a user metadata. It leverages Node.js with Express.js for backend API development, MySQL for structured data storage, Google Cloud Storage for audio file storage, Docker for containerization, and Jenkins for CI/CD automation.


## Buffer ->  Streaming a Video 
  If your Internet connection is fast enough, the speed of the stream will be fast enough to instantly fill up the buffer and send it out for processing. This repeat till the stream is finished.

    const buffer = new Buffer.from("Harshit Joshi");

    buffer.write("Code")
     
    res.send(buffer.toString());

## Stream -> Sequence of data that is being moved from one point to another
   you don't wait for entire fileA content to be saved in temporary memory before moving it into fileB


## Reading from a file as readable stream 
## Writing from a file as writable stream 
## Sockets as a duplex stream
## File Compression where you can write compressed data and read de-compressed data to and from a file as a transform stream


## Pipe -> Creates a Readable stream to a Writeable stream 
