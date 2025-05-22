
// Main API module that re-exports all services
import { get, post, put, patch, del, postFormData } from './apiUtils';
import { authService } from './authService';
import { fileService } from './fileService';
import { projectService } from './projectService';
import { userService } from './userService';
import { paymentService } from './paymentService';
import { roleService } from './roleService';

export {
  // Base API methods
  get,
  post,
  put,
  patch,
  del,
  postFormData,
  
  // Services
  authService,
  fileService,
  projectService,
  userService,
  paymentService,
  roleService
};
