import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import * as MongooseError from 'mongoose/lib/error';

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let error;

    switch (exception.name) {
      // case 'DocumentNotFoundError': {
      //   error = {
      //     statusCode: HttpStatus.NOT_FOUND,
      //     path: request.url,
      //     errorType: exception.name,
      //     errorMessage: 'Not Found',
      //   };
      //   break;
      // }
      // case 'MongooseError': { break; } // general Mongoose error
      case 'CastError': {
        error = {
          statusCode: HttpStatus.BAD_REQUEST,
          path: request.url,
          errorType: exception.name,
          errorMessage: exception.message,
        };
        break;
      }
      // case 'DisconnectedError': { break; }
      // case 'DivergentArrayError': { break; }
      // case 'MissingSchemaError': { break; }
      case 'ValidatorError': {
        error = {
          statusCode: HttpStatus.BAD_REQUEST,
          path: request.url,
          errorType: exception.name,
          errorMessage: exception.message,
        };
        break;
      }
      case 'ValidationError': {
        error = {
          statusCode: HttpStatus.BAD_REQUEST,
          path: request.url,
          errorType: exception.name,
          errorMessage: exception.message,
        };
        break;
      }
      // case 'ObjectExpectedError': { break; }
      // case 'ObjectParameterError': { break; }
      // case 'OverwriteModelError': { break; }
      // case 'ParallelSaveError': { break; }
      // case 'StrictModeError': { break; }
      // case 'VersionError': { break; }
      default: {
        error = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          path: request.url,
          errorType: exception.name,
          errorMessage: 'Internal Error',
        };
        break;
      }
    }
    response.status(error.statusCode).json(error);
    // response.status(error.statusCode).json(error);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    /**
     * @description Exception json response
     * @param message
     */
    const responseMessage = (type, message) => {
      response.status(status).json({
        statusCode: status,
        path: request.url,
        errorType: type,
        errorMessage: message,
      });
    };

    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    if (exception.message) {
      responseMessage('Error', exception.message);
    } else {
      responseMessage(exception.name, exception.message);
    }
  }
}
