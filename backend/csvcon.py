import csv


def csv_to_sql_mysql(csv_file, sql_file, table_name, delimiter=","):
    """
    Converts a CSV file to a MySQL-compatible SQL file.

    Args:
        csv_file (str): Path to the input CSV file.
        sql_file (str): Path to the output SQL file.
        table_name (str): Name of the SQL table.
        delimiter (str): Delimiter used in the CSV file (default: ',').
    """
    try:
        with open(csv_file, mode="r", encoding="utf-8") as csvfile, open(
            sql_file, mode="w", encoding="utf-8"
        ) as sqlfile:
            reader = csv.reader(csvfile, delimiter=delimiter)
            headers = next(reader)  # First row contains the column names

            # Clean up header names (remove quotes if present)
            headers = [header.strip('"').strip() for header in headers]
            column_names = ", ".join([f"`{col}`" for col in headers])

            sqlfile.write(f"USE `common_consultancy`;\n\n")
            sqlfile.write(f"-- SQL INSERT statements for table `{table_name}`\n\n")

            for row in reader:
                # Escape single quotes and handle NULL values
                escaped_row = [
                    f"'{value.replace('\'', '\'\'')}'" if value else "NULL"
                    for value in row
                ]
                # Create the INSERT statement
                insert_statement = f"INSERT INTO `{table_name}` ({column_names}) VALUES ({', '.join(escaped_row)});\n"
                sqlfile.write(insert_statement)

        print(f"SQL file generated successfully: {sql_file}")
    except Exception as e:
        print(f"Error: {e}")


# Example usage
if __name__ == "__main__":
    csv_file = "../DATA-CC/timeFiltered.csv"  # Replace with your CSV file path
    sql_file = "time.sql"  # Replace with your desired SQL file path
    table_name = "time"  # Replace with your table name
    csv_to_sql_mysql(
        csv_file, sql_file, table_name, delimiter=";"
    )  # Adjust delimiter as needed
