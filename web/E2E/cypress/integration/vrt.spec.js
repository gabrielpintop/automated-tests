context("Todoist test", () => {
  it("makes a succesful login ", () => {
    cy.visit("https://todoist.com/");
    cy.screenshot("Home");
    cy.get('a[href="/users/showlogin"]').click();
    cy.get("#email").type("af.varon@uniandes.edu.co");
    cy.get("#password").type("Pruebas1234");
    cy.get(".sel_login").click();
    cy.get(".simple_content").should("contain", "Today");
    cy.screenshot("Inicial");
  });

  it("creates a new item", () => {
    cy.get(".plus_add_button").click();
    cy.get(".task_editor__editing_area").type("Prueba Creacion Tarea");
    cy.screenshot("CrearTarea");
    cy.get(".task_editor__editing_area").type("{enter}");
  });

  it("deletes an item", () => {
    cy.get(".markdown_content.task_content").last().click();
    cy.get(".item_action.item_actions_more").click();
    cy.screenshot("BorrarTarea");
    cy.get(".icon_menu_item__content").contains("Delete task").click();
    cy.get(".ist_button.ist_button_red").contains("Delete").click();
  });

  it("creates a new project", () => {
    cy.get(".action.sel_add_project").click();
    cy.get("#edit_project_modal_field_name").type("Prueba Creacion Proyecto");
    cy.screenshot("CrearProyecto");
    cy.get(".reactist_modal_box__actions .ist_button.ist_button_red")
      .contains("Add")
      .click();
  });

  it("deletes an project", () => {
    cy.wait(3000);
    cy.get('button[aria-label="Project options menu"]').click();
    cy.screenshot("BorrarProyecto");
    cy.get(".icon_menu_item__content").contains("Delete project").click();
    cy.get(".ist_button.ist_button_red").contains("Delete").click();
  });

  it("views upcoming tasks", () => {
    cy.get("#filter_upcoming").click();
    cy.screenshot("VerUpcoming");
    cy.get(".upcoming_view__calendar__controls__picker").should("be.visible");
  });

  it("views inbox", () => {
    cy.get("#filter_inbox").click();
    cy.screenshot("VerInbox");
    cy.get(".view_header__content").should("contain", "Inbox");
  });
});
