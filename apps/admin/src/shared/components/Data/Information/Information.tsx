import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/tabs';

import './Information.scss';

export interface ITab {
  title: string | React.ReactNode;
  isDisabled: boolean;
}

export interface ITabPanel {
  direction?: 'row' | 'column';
  rows: { blocks: React.ReactNode[]; style?: React.CSSProperties }[];
}

export const Information = ({
  header,
  footer,
  tabList,
  tabPanels,
}: {
  header?: React.ReactNode[];
  footer?: React.ReactNode[];
  tabList: ITab[];
  tabPanels: ITabPanel[];
}) => {
  return (
    <div className="information">
      <div className="information-content">
        {header && (
          <div className="information-header">
            {header?.map((block: any, index: number) => (
              <div
                key={`information-header-block-${index}`}
                className="information-header-block"
              >
                {block}
              </div>
            ))}
          </div>
        )}

        <Tabs>
          <TabList
            borderBottom="4px solid #EFEFEF"
            color="#BFBFBF"
            paddingTop={'1'}
          >
            {tabList.map((tab: ITab, index: number) => (
              <Tab
                isDisabled={tab.isDisabled}
                key={`information-tab-${index}`}
                _hover={{ color: '#3182FC' }}
                _focus={{ boxShadow: 'none' }}
                _selected={{
                  color: '#3182FC',
                  fontWeight: '500',
                  borderBottom: '4px solid #3182FC',
                  marginBottom: '-4px',
                }}
              >
                {tab.title}
              </Tab>
            ))}
          </TabList>

          <TabPanels maxHeight="100%" paddingBottom={'12'}>
            {tabPanels.map(
              ({ direction = 'row', rows }: ITabPanel, index: number) => (
                /* Cargamos cada TAB, ordenando los bloques en horizontal o vertical segun @direction */
                <TabPanel
                  pt="30px"
                  display={direction === 'column' ? 'flex' : 'block'}
                  key={`information-tabpanel-${index}`}
                >
                  {rows.map(
                    (
                      {
                        blocks,
                        style,
                      }: {
                        blocks: React.ReactNode[];
                        style?: React.CSSProperties;
                      },
                      index: number
                    ) => (
                      <div
                        style={style}
                        key={`information-row-${index}`}
                        className={
                          direction === 'row'
                            ? 'information-row'
                            : 'information-column'
                        }
                      >
                        {blocks.map((block: React.ReactNode, index: number) => {
                          if (!block) return undefined;

                          return (
                            <div
                              key={`information-row-block-${index}`}
                              className={
                                direction === 'row'
                                  ? 'information-row-block'
                                  : 'information-column-block'
                              }
                            >
                              {block}
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </TabPanel>
              )
            )}
          </TabPanels>
        </Tabs>
      </div>

      {footer && (
        <div className="information-footer">
          {footer?.map((block: any, index: number) => (
            <div
              key={`information-footer-block-${index}`}
              className="information-footer-block"
            >
              {block}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
