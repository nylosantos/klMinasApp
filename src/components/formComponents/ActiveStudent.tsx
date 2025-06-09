interface ActiveStudentProps<T> {
  studentData: T;
  userRole: string;
}

export default function ActiveStudent<T extends { active: boolean }>({
  studentData,
  userRole,
}: ActiveStudentProps<T>) {
  return (
    <div className="flex flex-col gap-2 items-center w-full justify-center py-2">
      {!studentData.active && (
        <>
          {" "}
          <p className="col-span-2 text-right text-red-600 dark:text-yellow-500 uppercase">
            Atenção, cadastro inativo
          </p>
          {userRole === "user" && (
            <p className="col-span-2 text-sm text-right text-red-600 dark:text-yellow-500">
              Para reativar, entre em contato com a administração da escola
            </p>
          )}
        </>
      )}
    </div>
  );
}
