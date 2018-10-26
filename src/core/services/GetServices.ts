import { IServices } from "../../app";

export function getServices(component): IServices {
  if (component.$parent) {
    return getServices(component.$parent);
  } else {
    return component.globalData.services;
  }
}
