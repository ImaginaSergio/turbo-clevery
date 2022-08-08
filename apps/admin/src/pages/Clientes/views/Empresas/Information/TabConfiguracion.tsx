import { useState } from 'react';

import { BiRadioCircle, BiRadioCircleMarked } from 'react-icons/bi';
import {
  Flex,
  Box,
  Icon,
  Tabs,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';

import { IEmpresa, AdminConfig, CampusConfig } from '@clevery/data';

type TabConfiguracionProps = {
  empresa: IEmpresa;
  updateValue: (value: any) => void;
};

enum ConfigSelect {
  CAMPUS,
  ADMIN,
}

export const TabConfiguracion = ({
  empresa,
  updateValue,
}: TabConfiguracionProps) => {
  const [configSelect, setConfigSelect] = useState<ConfigSelect>(
    ConfigSelect.CAMPUS
  );

  const updateConfig = ({
    type,
    rol,
    page,
    config,
  }: {
    type: 'admin' | 'campus';
    rol: any;
    page: any;
    config: { name: string; label: any; value: boolean };
  }) => {
    let res: any = {};

    if (type === 'campus') {
      res = { ...empresa.configCampus };
      res[rol][page][config.name] = {
        label: config.label,
        value: config.value,
      };
      updateValue({ configCampus: res });
    } else {
      res = { ...empresa.configAdmin };
      res[rol][page][config.name] = {
        label: config.label,
        value: config.value,
      };
      updateValue({ configAdmin: res });
    }
  };

  const createAdminConfig = () => {
    updateValue({ configAdmin: AdminConfig });
  };

  const createCampusConfig = () => {
    updateValue({ configCampus: CampusConfig });
  };

  return (
    <Flex
      direction="column"
      p="30px"
      boxSize="100%"
      rowGap="30px"
      overflow="auto"
    >
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Configuración de acceso
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          En esta página estableceremos la configuración de acceso de los
          usuarios al campus, según su rol.
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
        <Tabs w="100%">
          <TabList>
            {configSelect === ConfigSelect.ADMIN ? (
              <Tab>Admin</Tab>
            ) : (
              Object.keys(CampusConfig)?.map((v) => <Tab>{v}</Tab>)
            )}

            <Button
              ml="auto"
              onClick={() =>
                setConfigSelect(
                  configSelect === ConfigSelect.ADMIN
                    ? ConfigSelect.CAMPUS
                    : ConfigSelect.ADMIN
                )
              }
            >
              {configSelect === ConfigSelect.ADMIN
                ? 'Configuración Campus'
                : 'Configuración Admin'}
            </Button>
          </TabList>

          <TabPanels>
            {configSelect === ConfigSelect.CAMPUS &&
              (empresa.configCampus ? (
                Object.entries(empresa.configCampus).map(
                  ([rolKey, rolValue]) => (
                    <TabPanel>
                      <Flex direction="column" gap="12px" w="100%" wrap="wrap">
                        {Object.entries(rolValue).map(
                          ([pageKey, pageValue], index) => (
                            <Flex direction="column" key={'config-' + index}>
                              <Box
                                fontWeight="bold"
                                fontSize="16px"
                                textTransform="capitalize"
                              >
                                {pageKey}
                              </Box>

                              {Object.entries(pageValue)?.map(
                                ([name, config]) => (
                                  <InformationRadioSelect
                                    name={name}
                                    label={config.label}
                                    value={config.value}
                                    updateValue={(e?: any) =>
                                      updateConfig({
                                        type: 'campus',
                                        rol: rolKey,
                                        page: pageKey,
                                        config: {
                                          name,
                                          label: config.label,
                                          value:
                                            config.value === true
                                              ? false
                                              : true,
                                        },
                                      })
                                    }
                                  />
                                )
                              )}
                            </Flex>
                          )
                        )}
                      </Flex>
                    </TabPanel>
                  )
                )
              ) : (
                <Flex pt="40px">
                  <Button onClick={createCampusConfig}>
                    Crear configuración del campus
                  </Button>
                </Flex>
              ))}

            {configSelect === ConfigSelect.ADMIN &&
              (empresa.configAdmin ? (
                Object.entries(empresa.configAdmin).map(
                  ([rolKey, rolValue]) => (
                    <TabPanel>
                      <Flex direction="column" gap="12px" w="100%" wrap="wrap">
                        {Object.entries(rolValue).map(
                          ([pageKey, pageValue], index: number) => (
                            <Flex direction="column" key={'column-' + index}>
                              <Box
                                fontWeight="bold"
                                fontSize="16px"
                                textTransform="capitalize"
                              >
                                {pageKey}
                              </Box>

                              {Object.entries(pageValue)?.map(
                                ([name, config], index) => (
                                  <InformationRadioSelect
                                    key={'item-' + index}
                                    name={name}
                                    label={config.label}
                                    value={config.value}
                                    updateValue={(e?: any) =>
                                      updateConfig({
                                        type: 'admin',
                                        rol: rolKey,
                                        page: pageKey,
                                        config: {
                                          name,
                                          label: config.label,
                                          value:
                                            config.value === true
                                              ? false
                                              : true,
                                        },
                                      })
                                    }
                                  />
                                )
                              )}
                            </Flex>
                          )
                        )}
                      </Flex>
                    </TabPanel>
                  )
                )
              ) : (
                <Flex pt="40px">
                  <Button onClick={createAdminConfig}>
                    Crear configuración de Admin
                  </Button>
                </Flex>
              ))}
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
};

const InformationRadioSelect = ({
  label,
  name,
  value,
  updateValue,
}: {
  label?: string;
  name?: string;
  value: boolean;
  updateValue: (e?: any) => any | void;
}) => {
  return (
    <Flex
      gap="4px"
      align="center"
      w="fit-content"
      cursor="pointer"
      onClick={() =>
        updateValue({ label, value: value === true ? false : true })
      }
    >
      <Box fontWeight="semibold" fontSize="14px">
        {label}
      </Box>

      <Icon
        boxSize="32px"
        color={value === true ? 'accept' : 'gray_4'}
        as={value === true ? BiRadioCircleMarked : BiRadioCircle}
      />
    </Flex>
  );
};
