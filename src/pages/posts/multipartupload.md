---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Multipart uploads with AWS"
description: ""
created: 2023-07-26
author: "lucida"
tags: ["software engineering"]
---

## What are multipart uploads?

Uploading huge files can take a long time. To solve this problem, we can upload a single file as a set of parts, with each part representing a contiguous part of the file. These parts can be uploaded in parallel, and are indepedent of one another. One part failing to upload will not stop the entire upload.

## Multipart uploads with AWS

The process of multipart uploads in AWS is as follows:

1. [Initiate a multipart upload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateMultipartUpload.html). This returns an upload ID. This ID associates your upload part requests, as well as the final complete or abort request to a specific multipart upload.
2. Upload your parts using part requests. You have the choice of [`UploadPart`](https://docs.aws.amazon.com/AmazonS3/latest/API/API_UploadPart.html) or [`UploadPartCopy`](https://docs.aws.amazon.com/AmazonS3/latest/API/API_UploadPartCopy.html), each with their pros, cons, and limitations.
3. [Complete your multipart upload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html) with a list of all your uploaded parts.
4. Alternatively, [abort your multipart upload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_AbortMultipartUpload.html).

How you orchestrate your multipart upload will depend greatly on your final file size, the sizes of each part, as well as the limits of multipart upload.

### AWS multipart upload limits

As of this post, the [limits of AWS multipart upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) are as follows:

- **Maximum object size**: `5 TiB`
- **Maximum number of parts per upload**: `10000`
- **Part numbers**: `[1, 10000]`
- **Part size**: `[5 MiB, 5 GiB]` with no minimum size limit on the last part

With the above limits, you may face some problems, such as:

1. Some parts may not be within the part size limit of `[5 MiB, 5 GiB]`.
2. Minimising the number of parts per upload.
3. Ensuring that your function or program does not run out of memory by holding too many objects in memory.

### `UploadPart`

This uploads a part in a multipart upload. You must provide the content body of the part. If you are running this in a lambda, you will be holding the content body in memory.

A typical implementation of multipart uploads would be to retrieve byte ranges of a huge file and upload it part by part using `UploadPart`.

### `UploadPartCopy`

This copies an existing S3 object to be used as a part in a multipart upload. Note that you can specify byte ranges as well. Compared to `UploadPart`, you do not have to hold the content body in memory, allowing you to specify larger parts using this method.

If you need to merge multiple objects that are within the part size limit of `[5 MiB, 5 GiB]`, this is an efficient way to do so.

## Thinking with parts

Given many different parts of different sizes, how can you merge them all using multipart uploads?

We can achieve the above by optimising part sizes, as well as the number of parts. This allows us to upload the _biggest_ file using the _smallest_ number of parts.

This is the process I found worked for our use case:

1. To optimise part sizes, we need to know each part's size. For parts on S3, we can perform `HeadObject` on them.
2. We have to partition parts by their size. Parts larger than `5 MiB` are considered large, and must be handled differently from parts smaller than `5 MiB`, which are considered small.
3. For large parts, we will leverage `UploadPartCopy` since we can use byte ranges to ensure parts are within the part size limit.
   1. For large parts within the part size limit, we upload them as a part using `UploadPartCopy`.
   2. For large parts larger than the part size limit, we partition them into parts of size `5 GiB - 5 MiB`. This ensures that the final part is at least 5 MiB in size.
4. For small parts, we will leverage `UploadPart` since we have to construct parts that are at least `5 MiB` in size.
   1. We group small parts into a single part by joining their contents.
   2. You may choose to only form `5 MiB` groups using small parts, or form groups as much as your function or program allows.
5. Complete your multipart upload!

Note that through this process, the original order of the files are not preserved. If the order by which the files are merged is important, this process will not work.

### What if order matters?

If the order matters, I suggest you explore using byte ranges to create parts across multiple files.

Since `UploadPartCopy` only works for a single object, you are restricted to using `UploadPart` to upload your part. Therefore, the sizes of your parts will be restricted by the memory limits of your function or program.

## Last words

This was a fun problem to solve, especially when I had the _eureka_ moment of splitting files larger than `5 GiB` into `5 GiB - 5 MiB` parts.

It is helpful to structure your functions such that one generates a set of instructions to be executed, while another function consumes these instructions and executes them. This allows you to test your feature logic without caring about implementation detail.

Here is the [code](https://gist.github.com/yongjiajie/8278193e7dbf6982453f692eaf67954d).

Thanks for reading!
