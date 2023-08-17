const readline = require("readline");

let contacts = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const addContact = () => {
  rl.question("Enter your name: ", (name) => {
    rl.question("Enter your phone number: ", (phone) => {
      console.log("Contact added successfully!");
      contacts.push({ name, phone });
      showMenu();
    });
  });
};

const displayContacts = () => {
  if (contacts.length) {
    console.log("Contact list");
    contacts.forEach((contact) => {
      console.log(`Name: ${contact.name}, Phone Number: ${contact.phone}`);
    });
  } else {
    console.log("Contact list is empty");
  }
  showMenu();
};

const searchContact = () => {
  rl.question("Enter the name of the contact you're looking for: ", (name) => {
    let foundContact = contacts.find(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
    if (foundContact) {
      console.log(
        `Name: ${foundContact.name}, Phone Number: ${foundContact.phone}`
      );
    } else {
      console.log("Contact not found");
    }
    showMenu();
  });
};

rl.on("close", () => {
  console.log("GoodBye!");
});

const showMenu = () => {
  console.log("1. Add contact");
  console.log("2. View contacts");
  console.log("3. Search for contact");
  console.log("4. Exit");

  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        addContact();
        break;
      case "2":
        displayContacts();
        break;
      case "3":
        searchContact();
        break;
      case "4":
        rl.close();
        break;
      default:
        showMenu();
        break;
    }
  });
};

showMenu();
