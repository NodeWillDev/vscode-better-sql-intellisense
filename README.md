<h1 align="center">Better SQL Intellisense</h1>

## Support

- **MySQL**
- **SQLite3**

---

## Settings

### Remote Connection (`database-remote`)

- **Key**: `better-sql-intellisense.database-remote`
  - IF `true`: Enables connection to cloud database.
  - IF `false`: Disables connection attempts.

#### Mandatory settings (if `remote = true`):

- `better-sql-intellisense.database-remote-user`: Database user.
- `better-sql-intellisense.database-remote-password`: Database password.
- `better-sql-intellisense.database-remote-host`: Database host.
- `better-sql-intellisense.database-remote-port`: Database port
- `better-sql-intellisense.database-remote-database`: Name of the database to be used.

---

### Local Connection (`database-local`)

- **Key**: `better-sql-intellisense.database-local`
  - Allows you to use local SQL files. Example:
    ```json
    ["/home/var/table1.sqlite", "/home/var/table2.sqlite"]
    ```
  - ❗ _It is not necessary to specify the file extension; the system will try to resolve it automatically._

---

### Color Customization

- **Key**: `better-sql-intellisense.sql-code-color`
  - Sets the color (in **HEXADECIMAL**) for SQL code reality.
  - Example: `#FF5733`.

<video width="45%" controls>
  <source src="./assets/sql-color-demo.mp4" type="video/mp4">  
</video>
---

### Credits:

- NodeWillDev (William da Silva)
  - [GitHub](https://github.com/NodeWillDev)
