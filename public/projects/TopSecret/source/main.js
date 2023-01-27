/////////////////////////////////////////////////
// main.js -- TopSecret application entry point.
//

"use strict";

// Define global error handler.
const functionError = (e) => {

		try {

			// Just get the element and set its inner text.
			const divError = document.getElementById("ErrorDiv");
			let strText = "";
			if (e) {

				strText = e.message;
				divError.classList.add("ContentLikeBorder");
			} else {

				divError.classList.remove("ContentLikeBorder");
			}
			divError.innerText = strText;
		} catch (eInner) {

			// Last resort, an alert:
			alert(`Failed to report error: ${e.message}, because: ${eInner.message}.`);
		}
	};


// Require system helper "modules".
require(["../../../MithrilLib/utility/Rest",
	"../../../MithrilLib/utility/TimerCutSwitch"],
	(Rest, TimerCutSwitch) => {

		try {

			// Collection of secrets.
			let arraySecrets = [];

			// Not valid until data is loaded.
			let bValid = false;

			// Psst....
			let strPassword = "";

			// Allocate Rest object and initialze
			// to the mongo collection interface.
			const rest = new Rest("TopSecretCollection");

			// Grab reference to the password input.
			const divPassword = document.getElementById("PasswordDiv");
			divPassword.focus();

			// Grab reference to the content div.
			const divContent = document.getElementById("ContentDiv");

			// Grab reference to the add div.
			const divAddSecret = document.getElementById("AddSecretDiv");

			// Define a method that adds a contentitem to the DOM.
			const functionAddContentItem = (doc) => {

					try {

						// Create a new content item.
						const divContentItem = document.createElement("div");
						divContentItem.classList.add("ContentItem");

						const divContentItemBody = document.createElement("div");
						divContentItemBody.classList.add("ContentItemBody");
						divContentItemBody.contentEditable = true;
						divContentItemBody.innerHTML = doc.body;

						// Ensure closures for update:
						const docUpdate = doc;
						const divContentItemBodyUpdate = divContentItemBody;

						// Define a TCE that will update the
						// doc when the user modifies the DOM.
						divContentItemBodyUpdate.tce = new TimerCutSwitch(() => {

								try {

									// Get the body to save.
									docUpdate.body = divContentItemBodyUpdate.innerHTML;

									// Update it.
									rest.update(docUpdate,
										(objectPayload) => {

											// Don't do anything.
										},
										(strError) => {

											functionError(new Error(strError));
										});
								} catch (e) {

									functionError(e);
								}
							}, 500);

						// Mark the tce.
						divContentItemBody.addEventListener("input",
							divContentItemBodyUpdate.tce.tick);

						const divContentItemRemove = document.createElement("div");
						divContentItemRemove.classList.add("ContentItemRemove");
						divContentItemRemove.classList.add("ContentLikeBorder");
						divContentItemRemove.innerHTML = "x";

						// Ensure closures for delete:
						const docDelete = doc;
						const divDelete = divContentItem;
						divContentItemRemove.addEventListener("click", () => {

								try {

									// Delete document.
									rest.delete(docDelete,
										(objectPayload) => {

											try {

												// Remove from JS.
												const iIndex = arraySecrets.indexOf(docDelete);
												arraySecrets.slice(iIndex,
													1);

												// Remove from DOM.
												divContent.removeChild(divDelete);
											} catch (e) {

												functionError(e);
											}
										},
										(strError) => {

											functionError(new Error(strError));
										});
								} catch (e) {

									functionError(e);
								}
							});

						divContentItem.appendChild(divContentItemBody);
						divContentItem.appendChild(divContentItemRemove);

						// Add it to the content.
						divContent.insertBefore(divContentItem,
							divContent.firstChild);

						// Add it to the JS collection as well.
						arraySecrets.push(doc);
					} catch (e) {

						functionError(e);
					}
				};

			// Wire the click event to the add secret "button".
			divAddSecret.addEventListener("click", () => {

					try {

						if (!bValid) {

							return;
						}

						// Add a new document.
						const doc = {

							password: strPassword,
							body: "..."
						};
						rest.insert(doc,
							(docid) => {

								try {

									// Save the id.
									doc._id = docid;

									// Add a new content item.
									functionAddContentItem(doc);
								} catch (e) {

									functionError(e);
								}
							},
							(strError) => {

								functionError(new Error(strError));
							});
					} catch (e) {

						functionError(e);
					}
				});

			// Function loads data when the password input value changes.
			const functionLoadData = () => {

					try {

						// No longer valid until data comes back.
						divAddSecret.classList.remove("SomeKindOfButton");
						bValid = false;

						// Clear secrets (JS).
						arraySecrets = [];

						// Clear secrets (DOM).
						while (divContent.childNodes.length) {

							divContent.removeChild(divContent.childNodes[0]);
						}

						// Get value from password.
						if (divPassword.childNodes.length > 0) {

							// Critical to get and save off password.
							strPassword = divPassword.childNodes[0].textContent;

							// Try to select data from Mongo.
							const objectFilter = {

								password: strPassword
							};
							const exceptionRet = rest.select(objectFilter,
								(arrayResults) => {

									try {

										// Do something with the payload.
										arrayResults.forEach((doc) => {

												try {

													// Add a content item.
													functionAddContentItem(doc);
												} catch (e) {

													functionError(e);
												}
											});

										// Enable GUI.
										divAddSecret.classList.add("SomeKindOfButton");
										bValid = true;
									} catch (e) {

										functionError(e);
									}
								},
								(strError) => {

									functionError(new Error(strError));
								});
							if (exceptionRet) {

								throw exceptionRet;
							}
						}
					} catch (e) {

						functionError(e);
					}
				};

			// Define the timer cut switch to
			// load data after a 500ms pause.
			// Wire changes to password input.
			const tcsPassword = new TimerCutSwitch(functionLoadData,
				500);
			divPassword.addEventListener("input", () => {

					try {

						// Clear error.
						functionError();

						// Slate.
						tcsPassword.tick();
					} catch (e) {

						functionError(e);
					}
				});
			divPassword.addEventListener("keydown", (event) => {

					try {

						// Stop processing ENTER key.
						if (event.which === 13) {

							event.stopPropagation();
							event.preventDefault();

							return false;
						}
					} catch (e) {

						functionError(e);
					}
				});

			// Create an observer instance.
			const mo = new MutationObserver((arrayMutations) => {

					try {

						// Stop observing.
						mo.disconnect();

						// Remove all nodes after the first.
						while (divPassword.childNodes.length > 1) {

							divPassword.removeChild(divPassword.childNodes[1]);
						}

						// Start observing again.
						mo.observe(divPassword, {

								childList: true
							});
					} catch (e) {

						functionError(e);
					}
				});

			// Start observing the target
			// for configured mutations.
			mo.observe(divPassword, {

					childList: true
				});
		} catch (e) {

			functionError(e);
		}
	});