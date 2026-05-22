const fs = require("node:fs");

const originalReadlinkSync = fs.readlinkSync;
const originalReadlink = fs.readlink;
const originalPromisesReadlink = fs.promises.readlink;

function isWindowsNonSymlinkReadlinkError(error, pathLike) {
  if (!error || error.code !== "EISDIR") return false;
  try {
    return !fs.lstatSync(pathLike).isSymbolicLink();
  } catch {
    return false;
  }
}

fs.readlinkSync = function patchedReadlinkSync(pathLike, options) {
  try {
    return originalReadlinkSync.call(fs, pathLike, options);
  } catch (error) {
    if (isWindowsNonSymlinkReadlinkError(error, pathLike)) {
      const nextError = new Error(`EINVAL: invalid argument, readlink '${pathLike}'`);
      nextError.code = "EINVAL";
      nextError.errno = -4071;
      nextError.syscall = "readlink";
      nextError.path = pathLike;
      throw nextError;
    }
    throw error;
  }
};

fs.readlink = function patchedReadlink(pathLike, options, callback) {
  const cb = typeof options === "function" ? options : callback;
  const opts = typeof options === "function" ? undefined : options;

  return originalReadlink.call(fs, pathLike, opts, (error, linkString) => {
    if (isWindowsNonSymlinkReadlinkError(error, pathLike)) {
      const nextError = new Error(`EINVAL: invalid argument, readlink '${pathLike}'`);
      nextError.code = "EINVAL";
      nextError.errno = -4071;
      nextError.syscall = "readlink";
      nextError.path = pathLike;
      cb(nextError);
      return;
    }
    cb(error, linkString);
  });
};

fs.promises.readlink = async function patchedPromisesReadlink(pathLike, options) {
  try {
    return await originalPromisesReadlink.call(fs.promises, pathLike, options);
  } catch (error) {
    if (isWindowsNonSymlinkReadlinkError(error, pathLike)) {
      const nextError = new Error(`EINVAL: invalid argument, readlink '${pathLike}'`);
      nextError.code = "EINVAL";
      nextError.errno = -4071;
      nextError.syscall = "readlink";
      nextError.path = pathLike;
      throw nextError;
    }
    throw error;
  }
};
