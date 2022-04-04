import Express from "express";
import path from "path";
import fs from 'fs';
import {ResponseError} from "./response-error";

const router = Express.Router();

/**
 * Registers Controller to Express Router
 * 
 * Note: Don't edit this file unless you know what you're doing
 * 
 * @author Michael Allen Elguira <michael01@simplexi.com.ph>
 */
export const registerController = (controllerDirectory: string) => {
  const controllerFilenames = getFilenames(controllerDirectory);

  controllerFilenames.forEach((controllerFilename: string) => {
    const [filename] = controllerFilename.split('.');

    const hanlder = require(path.join(controllerDirectory, controllerFilename));

    const uri = (filename)
      .replace(/\[([\w\-. ]+)\]/gm, (matchedString) => ':' + matchedString.slice(1, -1))
      .replace(/\\/gm, '\/')
      .replace('/index', '');

    Object.keys(hanlder).forEach((method: string) => {
      type TExpresmethods = 'get'|'post'|'put'|'delete';
      router[method.toLocaleLowerCase() as TExpresmethods](uri, async (...args) => {
        const [, oResponse] = args;
        try {
          await hanlder[method](...args);
        } catch (error) {
          if (error instanceof ResponseError) {
            oResponse.status(error.code).json({
              success: false,
              status: error.code,
              message: error.message
            });
          } else if (error instanceof Error) {
            oResponse.status(500).json({
              success: false,
              status: 500,
              message: error.message
            });
          }
        }
      });
    });
  });

  return router;
}

/**
 * Get all filenames in directories and sub-directories
 * 
 * @author Michael Allen Elguira <michael01@simplexi.com.ph>
 */
function getFilenames(sRootDirectory: string) {
  let aFiles: string[] = [];

  const recursiveFilenameGrepper = (sDirectory: string) => {
    fs.readdirSync(sDirectory).forEach(filename => {
      const sFilepath = path.resolve(sDirectory, filename);

      if (fs.statSync(sFilepath).isDirectory()) recursiveFilenameGrepper(sFilepath);
      else aFiles.push(sFilepath.replace(sRootDirectory, ''));
    });
  };

  recursiveFilenameGrepper(sRootDirectory);

  return aFiles;
}
