{/* NAME */}
          <div className="flex gap-2 items-center">
            <label htmlFor="name" className="w-2/4 text-right">
              Nome:{" "}
            </label>
            <input
              {...register("name")}
              type="text"
              name="name"
              placeholder={
                errors.name
                  ? "É necessário inserir o Nome completo do aluno"
                  : "Insira o nome completo do aluno"
              }
              className={
                errors.name
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
            />
          </div>

          {/* E-MAIL */}
          <div className="flex gap-2 items-center">
            <label htmlFor="email" className="w-2/4 text-right">
              E-mail:{" "}
            </label>
            <input
              {...register("email")}
              type="text"
              name="email"
              placeholder={
                errors.email
                  ? "É necessário um endereço de e-mail"
                  : "Insira o e-mail"
              }
              className={
                errors.email
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
            />
          </div>

          {/* BIRTHDATE */}
          <div className="flex gap-2 items-center">
            <label htmlFor="birthDate" className="w-2/4 text-right">
              Data de Nascimento:{" "}
            </label>
            <div className="w-2/4">
              <Controller
                control={control}
                name="birthDate"
                render={({
                  field: { onChange, name, value },
                  fieldState: { invalid, isDirty }, //optional
                  formState: { errors }, //optional, but necessary if you want to show an error message
                }) => (
                  <DatePicker
                    value={value || ""}
                    placeholder={
                      errors.name
                        ? "É necessário selecionar uma Data"
                        : "Selecione uma Data"
                    }
                    currentDate={new DateObject().subtract(3, "years")}
                    inputClass={
                      errors.name
                        ? "px-2 py-1 border border-red-600"
                        : "px-2 py-1 border border-gray-100 dark:border-black"
                    }
                    maxDate={new DateObject().subtract(3, "years")}
                    onChange={(date) => {
                      onChange(date ? date : "");
                    }}
                    format="DD/MM/YYYY"
                  />
                )}
              />
            </div>
          </div>

          {/* ADDRESS */}
          {/* CEP */}
          <div className="flex gap-2 items-center">
            <label htmlFor="addressCep" className="w-2/4 text-right">
              CEP:{" "}
            </label>
            <div className="flex w-2/4 gap-2">
              <div className="w-10/12">
                <Controller
                  control={control}
                  name="addressCep"
                  render={({
                    field: { onChange, name, value },
                    fieldState: { isDirty }, //optional
                    formState: { errors }, //optional, but necessary if you want to show an error message
                  }) => (
                    <input
                      name={name}
                      type="text"
                      pattern="^[+ 0-9]{8}$"
                      maxLength={8}
                      placeholder={
                        errors.addressCep
                          ? "É necessário inserir um CEP"
                          : "Insira o CEP"
                      }
                      className={
                        errors.addressCep
                          ? "w-full px-2 py-1 border border-red-600"
                          : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                      }
                      onChange={(e) => {
                        onChange(
                          setAddress({
                            ...address,
                            cep: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1"),
                          })
                        );
                      }}
                    />
                  )}
                />
              </div>
              <button
                type="button"
                className="border rounded border-blue-900 bg-blue-500 disabled:bg-blue-400 text-white w-2/12"
                onClick={() => {
                  getCep(address.cep);
                }}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* STREET AND NUMBER */}
          <div className="flex gap-2 items-center">
            <label htmlFor="addressStreet" className="w-2/4 text-right">
              Rua:{" "}
            </label>
            <div className="flex w-2/4 gap-2 items-center">
              <div className="flex w-10/12">
                <input
                  {...register("addressStreet")}
                  type="text"
                  name="addressStreet"
                  value={address.street}
                  disabled={!editAddress}
                  placeholder={
                    errors.addressStreet
                      ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                      : "Rua / Av. / Pça"
                  }
                  className={
                    editAddress
                      ? errors.addressStreet
                        ? "w-full px-2 py-1 border border-red-600"
                        : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-2 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                />
              </div>
              <div className="flex w-2/12 items-center gap-2">
                <label htmlFor="addressNumber" className="text-right">
                  Nº:
                </label>
                <Controller
                  control={control}
                  name="addressNumber"
                  render={({
                    field: { onChange, name, value },
                    fieldState: { isDirty }, //optional
                    formState: { errors }, //optional, but necessary if you want to show an error message
                  }) => (
                    <input
                      name={name}
                      type="text"
                      placeholder={
                        errors.addressNumber
                          ? "Número"
                          : "Número"
                      }
                      className={
                        errors.addressNumber
                          ? "w-full px-2 py-1 border border-red-600"
                          : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                      }
                      onChange={(e) => {
                        onChange(
                          setAddress({
                            ...address,
                            number: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1"),
                          })
                        );
                      }}
                    />
                  )}
                />
                {/* <input
                  {...register("addressNumber")}
                  type="text"
                  name="addressNumber"
                  disabled={!editAddress}
                  placeholder={
                    errors.addressNumber
                      ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                      : "Número"
                  }
                  className={
                    editAddress
                      ? errors.addressNumber
                        ? "w-full px-2 py-1 border border-red-600"
                        : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-2 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                /> */}
              </div>
            </div>
          </div>

          {/* NEIGHBORHOOD AND COMPLEMENT */}
          <div className="flex gap-2 items-center">
            <label htmlFor="addressNeighborhood" className="w-2/4 text-right">
              Bairro:{" "}
            </label>
            <div className="flex w-2/4 gap-2 items-center">
              <div className="flex w-8/12">
                <input
                  {...register("addressNeighborhood")}
                  type="text"
                  name="addressNeighborhood"
                  value={address.neighborhood}
                  disabled={!editAddress}
                  placeholder={
                    errors.addressNeighborhood
                      ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                      : "Bairro"
                  }
                  className={
                    editAddress
                      ? errors.addressNeighborhood
                        ? "w-full px-2 py-1 border border-red-600"
                        : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-2 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                />
              </div>
              <div className="flex w-4/12 items-center gap-2">
                <label htmlFor="addressComplement" className="text-right">
                  Complemento:
                </label>
                <input
                  {...register("addressComplement")}
                  type="text"
                  name="addressComplement"
                  disabled={!editAddress}
                  placeholder={
                    errors.addressComplement
                      ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                      : "Apto | Bloco"
                  }
                  className={
                    editAddress
                      ? errors.addressComplement
                        ? "w-full px-2 py-1 border border-red-600"
                        : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-2 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                />
              </div>
            </div>
          </div>

          {/* CITY AND STATE */}
          <div className="flex gap-2 items-center">
            <label htmlFor="addressCity" className="w-2/4 text-right">
              Cidade:{" "}
            </label>
            <div className="flex w-2/4 gap-2 items-center">
              <div className="flex w-10/12">
                <input
                  {...register("addressCity")}
                  type="text"
                  name="addressCity"
                  value={address.city}
                  disabled={!editAddress}
                  placeholder={
                    errors.addressCity
                      ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                      : "Cidade"
                  }
                  className={
                    editAddress
                      ? errors.addressCity
                        ? "w-full px-2 py-1 border border-red-600"
                        : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-2 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                />
              </div>
              <div className="flex w-2/12 items-center gap-2">
                <label htmlFor="addressState" className="text-right">
                  Estado:
                </label>
                <input
                  {...register("addressState")}
                  type="text"
                  name="addressState"
                  value={address.state}
                  disabled={!editAddress}
                  placeholder={
                    errors.addressState
                      ? `Busque pelo CEP ou clique em "Editar Endereço" para inserir manualmente`
                      : "UF"
                  }
                  className={
                    editAddress
                      ? errors.addressState
                        ? "w-full px-2 py-1 border border-red-600"
                        : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-2 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                />
              </div>
            </div>
          </div>

          {/* EDIT ADDRESS BUTTON */}
          <div className="flex gap-2 items-center">
            <label
              htmlFor="editAddressButton"
              className="w-2/4 text-right"
            ></label>
            <button
              type="button"
              disabled={editAddress}
              className="border rounded border-orange-900 disabled:border-gray-800 bg-orange-500 disabled:bg-gray-200 text-white disabled:text-gray-500 w-2/4"
              onClick={() => setEditAddress(true)}
            >
              {editAddress
                ? "Insira o Endereço manualmente, ou busque o CEP novamente"
                : "Editar Endereço"}
            </button>
          </div>

          {/* PHONE */}
          <div className="flex gap-2 items-center">
            <label htmlFor="address" className="w-2/4 text-right">
              Telefone:{" "}
            </label>
            <div className="flex w-2/4 gap-2">
              <div className="flex w-10/12 items-center gap-1">
                <select
                  defaultValue={"DDD"}
                  className={
                    errors.phone
                      ? "pr-8 py-1 border border-red-600"
                      : "pr-8 py-1 border border-gray-100 dark:border-black"
                  }
                  name="DDD"
                  onChange={(e) => {
                    setFormatPhone({ ...formatPhone, ddd: e.target.value });
                  }}
                >
                  <BrazilianStateSelectOptions />
                </select>
                <input
                  type="text"
                  name="phoneInitial"
                  pattern="^[+ 0-9]{5}$"
                  maxLength={5}
                  value={
                    formatPhone.initial === "PREFIXO" ? "" : formatPhone.initial
                  }
                  placeholder={errors.phone ? "É necessário um" : "XXXXX"}
                  className={
                    errors.phone
                      ? "w-full px-6 py-1 border border-red-600"
                      : "w-full px-6 py-1 border border-gray-100 dark:border-black"
                  }
                  onChange={(e) => {
                    setFormatPhone({
                      ...formatPhone,
                      initial: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    });
                  }}
                />
                -
                <input
                  type="text"
                  name="phoneFinal"
                  pattern="^[+ 0-9]{4}$"
                  maxLength={4}
                  value={
                    formatPhone.final === "SUFIXO" ? "" : formatPhone.final
                  }
                  placeholder={errors.phone ? "telefone válido" : "XXXXX"}
                  className={
                    errors.phone
                      ? "w-full px-6 py-1 border border-red-600"
                      : "w-full px-6 py-1 border border-gray-100 dark:border-black"
                  }
                  onChange={(e) => {
                    setFormatPhone({
                      ...formatPhone,
                      final: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    });
                  }}
                />
                <input
                  {...register("phone")}
                  hidden
                  type="text"
                  name="phone"
                  value={
                    formatPhone.ddd && formatPhone.initial && formatPhone.final
                      ? `${formatPhone.ddd} ${formatPhone.initial}-${formatPhone.final}`
                      : ""
                  }
                  className={
                    errors.phone
                      ? "w-full px-2 py-1 border border-red-600"
                      : "w-full px-2 py-1 border border-gray-100 dark:border-black"
                  }
                />
              </div>
              <div className="w-2/12"></div>
            </div>
          </div>

          {/* PHONE SECONDARY */}
          <div className="flex gap-2 items-center">
            <label htmlFor="phoneSecondary" className="w-2/4 text-right">
              Telefone 2:{" "}
            </label>
            <div className="flex w-2/4 gap-2">
              <div className="flex w-10/12 items-center gap-1">
                <select
                  disabled={!activePhoneSecondary}
                  defaultValue={"DDD"}
                  className={
                    errors.phoneSecondary
                      ? "pr-8 py-1 border border-red-600"
                      : "pr-8 py-1 border border-gray-100 dark:border-black"
                  }
                  name="DDD"
                  onChange={(e) => {
                    setFormatPhoneSecondary({
                      ...formatPhoneSecondary,
                      ddd: e.target.value,
                    });
                  }}
                >
                  <BrazilianStateSelectOptions />
                </select>
                <input
                  type="text"
                  name="phoneInitial"
                  disabled={!activePhoneSecondary}
                  pattern="^[+ 0-9]{5}$"
                  maxLength={5}
                  value={
                    formatPhoneSecondary.initial === "PREFIXO"
                      ? ""
                      : formatPhoneSecondary.initial
                  }
                  placeholder={
                    errors.phoneSecondary ? "É necessário um" : "XXXXX"
                  }
                  className={
                    activePhoneSecondary
                      ? errors.phoneSecondary
                        ? "w-full px-6 py-1 border border-red-600"
                        : "w-full px-6 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-6 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                  onChange={(e) => {
                    setFormatPhoneSecondary({
                      ...formatPhoneSecondary,
                      initial: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    });
                  }}
                />
                -
                <input
                  type="text"
                  name="phoneFinal"
                  disabled={!activePhoneSecondary}
                  pattern="^[+ 0-9]{4}$"
                  maxLength={4}
                  value={
                    formatPhoneSecondary.final === "SUFIXO"
                      ? ""
                      : formatPhoneSecondary.final
                  }
                  placeholder={
                    errors.phoneSecondary ? "telefone válido" : "XXXXX"
                  }
                  className={
                    activePhoneSecondary
                      ? errors.phoneSecondary
                        ? "w-full px-6 py-1 border border-red-600"
                        : "w-full px-6 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-6 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                  onChange={(e) => {
                    setFormatPhoneSecondary({
                      ...formatPhoneSecondary,
                      final: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    });
                  }}
                />
              </div>
              <div className="flex w-2/12 items-center gap-2">
                <input
                  type="checkbox"
                  name="activePhoneSecondary"
                  className="ml-1"
                  checked={activePhoneSecondary}
                  onChange={() =>
                    setActivePhoneSecondary(!activePhoneSecondary)
                  }
                />
                <label
                  htmlFor="activePhoneSecondary"
                  className="text-sm text-gray-600 dark:text-gray-100"
                >
                  Incluir
                </label>
                <input
                  {...register("phoneSecondary")}
                  hidden
                  type="text"
                  name="phoneSecondary"
                  value={
                    formatPhoneSecondary.ddd &&
                    formatPhoneSecondary.initial &&
                    formatPhoneSecondary.final
                      ? `${formatPhoneSecondary.ddd} ${formatPhoneSecondary.initial}-${formatPhoneSecondary.final}`
                      : ""
                  }
                  className={
                    errors.phoneSecondary
                      ? "w-2/4 px-2 py-1 border border-red-600"
                      : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
                  }
                />
              </div>
            </div>
          </div>

          {/* PHONE TERTIARY */}
          <div className="flex gap-2 items-center">
            <label htmlFor="phoneTertiary" className="w-2/4 text-right">
              Telefone 3:{" "}
            </label>
            <div className="flex w-2/4 gap-2">
              <div className="flex w-10/12 items-center gap-1">
                <select
                  disabled={!activePhoneTertiary}
                  defaultValue={"DDD"}
                  className={
                    errors.phoneTertiary
                      ? "pr-8 py-1 border border-red-600"
                      : "pr-8 py-1 border border-gray-100 dark:border-black"
                  }
                  name="DDD"
                  onChange={(e) => {
                    setFormatPhoneTertiary({
                      ...formatPhoneTertiary,
                      ddd: e.target.value,
                    });
                  }}
                >
                  <BrazilianStateSelectOptions />
                </select>
                <input
                  type="text"
                  name="phoneInitial"
                  disabled={!activePhoneTertiary}
                  pattern="^[+ 0-9]{5}$"
                  maxLength={5}
                  value={
                    formatPhoneTertiary.initial === "PREFIXO"
                      ? ""
                      : formatPhoneTertiary.initial
                  }
                  placeholder={
                    errors.phoneTertiary ? "É necessário um" : "XXXXX"
                  }
                  className={
                    activePhoneTertiary
                      ? errors.phoneTertiary
                        ? "w-full px-6 py-1 border border-red-600"
                        : "w-full px-6 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-6 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                  onChange={(e) => {
                    setFormatPhoneTertiary({
                      ...formatPhoneTertiary,
                      initial: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    });
                  }}
                />
                -
                <input
                  type="text"
                  name="phoneFinal"
                  disabled={!activePhoneTertiary}
                  pattern="^[+ 0-9]{4}$"
                  maxLength={4}
                  value={
                    formatPhoneTertiary.final === "SUFIXO"
                      ? ""
                      : formatPhoneTertiary.final
                  }
                  placeholder={
                    errors.phoneTertiary ? "telefone válido" : "XXXXX"
                  }
                  className={
                    activePhoneTertiary
                      ? errors.phoneTertiary
                        ? "w-full px-6 py-1 border border-red-600"
                        : "w-full px-6 py-1 border border-gray-100 dark:border-black"
                      : "w-full px-6 py-1 border border-gray-100 dark:border-black opacity-70"
                  }
                  onChange={(e) => {
                    setFormatPhoneTertiary({
                      ...formatPhoneTertiary,
                      final: e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*?)\..*/g, "$1"),
                    });
                  }}
                />
              </div>
              <div className="flex w-2/12 items-center gap-2">
                <input
                  type="checkbox"
                  name="activePhoneTertiary"
                  className="ml-1"
                  checked={activePhoneTertiary}
                  onChange={() => setActivePhoneTertiary(!activePhoneTertiary)}
                />
                <label
                  htmlFor="activePhoneTertiary"
                  className="text-sm text-gray-600 dark:text-gray-100"
                >
                  Incluir
                </label>
                <input
                  {...register("phoneTertiary")}
                  hidden
                  type="text"
                  name="phoneTertiary"
                  value={
                    formatPhoneTertiary.ddd &&
                    formatPhoneTertiary.initial &&
                    formatPhoneTertiary.final
                      ? `${formatPhoneTertiary.ddd} ${formatPhoneTertiary.initial}-${formatPhoneTertiary.final}`
                      : ""
                  }
                  className={
                    errors.phoneTertiary
                      ? "w-2/4 px-2 py-1 border border-red-600"
                      : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
                  }
                />
              </div>
            </div>
          </div>

          {/* RESPONSIBLE */}
          <div className="flex gap-2 items-center">
            <label htmlFor="responsible" className="w-2/4 text-right">
              Responsável (diferente do responsável pela cobrança):{" "}
            </label>
            <input
              {...register("responsible")}
              type="text"
              name="responsible"
              placeholder={
                errors.responsible
                  ? "É necessário inserir o Nome completo do Responsável"
                  : "Insira o nome completo do Responsável"
              }
              className={
                errors.responsible
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
            />
          </div>

          {/* FINACIAL RESPONSIBLE */}
          <div className="flex gap-2 items-center">
            <label htmlFor="financialResponsible" className="w-2/4 text-right">
              Responsável Financeiro (responsável pela cobrança):{" "}
            </label>
            <input
              {...register("financialResponsible")}
              type="text"
              name="financialResponsible"
              placeholder={
                errors.financialResponsible
                  ? "É necessário inserir o Nome completo do Responsável Financeiro"
                  : "Insira o nome completo do Responsável Financeiro"
              }
              className={
                errors.financialResponsible
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
            />
          </div>

          {/* SCHOOL SELECT */}
          <div className="flex gap-2 items-center">
            <label htmlFor="schoolSelect" className="w-2/4 text-right">
              Selecione a Escola:{" "}
            </label>
            <select
              {...register("schoolId")}
              defaultValue={" -- select an option -- "}
              className={
                errors.schoolId
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
              name="schoolSelect"
            >
              <SelectOptions optionProps={props.school} />
            </select>
          </div>

          {/* SCHOOL CLASS SELECT */}
          <div className="flex gap-2 items-center">
            <label htmlFor="schoolClassSelect" className="w-2/4 text-right">
              Selecione a Turma:{" "}
            </label>
            <select
              {...register("schoolClassId")}
              defaultValue={" -- select an option -- "}
              className={
                errors.schoolClassId
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
              name="schoolClassSelect"
            >
              <SelectOptions optionProps={props.schoolClass} />
            </select>
          </div>

          {/* SCHOOL COURSE SELECT */}
          <div className="flex gap-2 items-center">
            <label htmlFor="schoolCourseSelect" className="w-2/4 text-right">
              Selecione o Curso:{" "}
            </label>
            <select
              {...register("schoolCourseId")}
              defaultValue={" -- select an option -- "}
              className={
                errors.schoolCourseId
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
              name="schoolCourseSelect"
            >
              <SelectOptions optionProps={props.schoolCourse} />
            </select>
          </div>

          {/* SCHEDULE SELECT */}
          <div className="flex gap-2 items-center">
            <label htmlFor="scheduleSelect" className="w-2/4 text-right">
              Selecione o Horário:{" "}
            </label>
            <select
              {...register("scheduleId")}
              defaultValue={" -- select an option -- "}
              className={
                errors.scheduleId
                  ? "w-2/4 px-2 py-1 border border-red-600"
                  : "w-2/4 px-2 py-1 border border-gray-100 dark:border-black"
              }
              name="scheduleSelect"
            >
              <SelectOptions optionProps={props.schedule} />
            </select>
          </div>

          {/* SUBMIT AND RESET BUTTONS */}
          <div className="flex gap-2">
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="border rounded border-blue-900 bg-blue-500 disabled:bg-blue-400 text-white w-2/4"
            >
              {!isSubmitting ? "Criar" : "Criando"}
            </button>

            {/* RESET BUTTON */}
            <button
              type="reset"
              className="border rounded border-gray-600 bg-gray-200 disabled:bg-gray-100 text-gray-600 w-2/4"
              disabled={isSubmitting}
              onClick={() => {
                resetForm();
              }}
            >
              {isSubmitting ? "Aguarde" : "Limpar"}
            </button>
          </div>