import { Icon } from '@chakra-ui/react';

import './PageSidebar.scss';

type PageSidebarProps = {
  title: string;
  items: {
    icon: any;
    title: string;
    isActive?: boolean;
    isDisabled?: boolean;
    onClick: () => void;
  }[];
};

const PageSidebar = ({ title, items }: PageSidebarProps) => {
  return (
    <div className="page-sidebar">
      {/* <div className="page-sidebar--title">{title}</div> */}

      <div className="page-sidebar--items">
        {items
          ?.filter((item) => !item.isDisabled)
          ?.map((item, index) => (
            <div
              key={`page-sidebar--item-${index}`}
              onClick={item.isDisabled ? undefined : item.onClick}
              className={`page-sidebar--item ${
                item.isDisabled
                  ? 'page-sidebar--item__disabled'
                  : item.isActive
                  ? 'page-sidebar--item__active'
                  : ''
              }`}
            >
              <Icon as={item.icon} boxSize="25px" />

              <div>{item.title}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export { PageSidebar };
