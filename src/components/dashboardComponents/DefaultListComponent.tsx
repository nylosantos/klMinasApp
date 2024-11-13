interface DefaultListComponentProps<T> {
  database: Array<T>;
  emptyMessage: string;
}

export default function DefaultListComponent<
  T extends { id: string; name: string }
>({ database, emptyMessage }: DefaultListComponentProps<T>) {
  return (
    <>
      {database.length !== 0 ? (
        database
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((school) => {
            return (
              <div className="flex justify-center p-4" key={school.id}>
                <p className="text-klGreen-500 dark:text-white">
                  {school.name}
                </p>
              </div>
            );
          })
      ) : (
        <div className="flex justify-center p-4 ">
          <p className="text-klGreen-500 dark:text-white">{emptyMessage}</p>
        </div>
      )}
    </>
  );
}
