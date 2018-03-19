/**
 * Intended to be implemented by models for forms which do postback actions. Holds the name
 * of an element the page should focus on after refresh in a hidden form element.
 */
export interface PostbackFocusTargetHolder {
  focusTarget: string
}
