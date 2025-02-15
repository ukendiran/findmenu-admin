const theme = {
  token: {
    // Global token customization
    colorPrimary: '#1e8f4f',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 6,
    wireframe: false,
    darkHeaderBg: '#001529',
  },
  components: {
    // Layout
    Layout: {
      // Light theme
      headerBg: 'rgba(255, 255, 255, 0.88)',
      headerColor: 'rgba(0, 0, 0, 0.88)',
      headerHeight: 64,
      footerBg: '#074225',
      footerPadding: '24px 50px',
      siderBg: '#ffffff',
      triggerBg: '#002140',
      triggerColor: '#fff',
      
      // Dark theme
      darkHeaderBg: '#001529',
      darkHeaderColor: 'rgba(255, 255, 255, 0.85)',
      darkSiderBg: '#001529',
      darkTriggerBg: '#002140',
      darkTriggerColor: '#fff',
    },
    
    // Menu
    Menu: {
      // Light theme
      itemBg: 'transparent',
      itemSelectedBg: 'green',
      itemColor: 'rgba(0, 0, 0, 0.88)',
      itemSelectedColor: '#fff',
      itemHoverColor: '#074225',
      itemHoverBg: '#78cf95',
      horizontalItemSelectedBg: 'transparent',
      horizontalItemBorderRadius: 4,
      colorBgElevated:"#fff",
      borderColor:"none",
      
      // Dark theme
      darkItemBg: '#001529',
      darkItemSelectedBg: '#074225',
      darkItemColor: 'rgba(255, 255, 255, 0.65)',
      darkItemSelectedColor: '#fff',
      darkItemHoverColor: '#fff',
      darkSubMenuItemBg: '#000c17',
    },
    
    // Button
    Button: {
      defaultBg: '#ffffff',
      defaultColor: 'rgba(0, 0, 0, 0.88)',
      defaultBorderColor: '#d9d9d9',
      primaryColor: '#fff',
      primaryShadow: 'none',
      dangerColor: '#fff',
      borderColorDisabled: '#d9d9d9',
      colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
      defaultGhostBorderColor: '#ffffff',
      defaultGhostColor: '#ffffff',
    },
    
    // Card
    Card: {
      colorBgContainer: '#ffffff',
      headerBg: 'transparent',
      headerFontSize: 16,
      headerFontSizeSM: 14,
      headerHeight: 48,
      headerHeightSM: 36,
      paddingLG: 24,
      paddingSM: 12,
      actionsBg: '#ffffff',
      actionsLiMargin: '12px 0',
    },
    
    // Table
    Table: {
      headerBg: '#fafafa',
      headerColor: 'rgba(0, 0, 0, 0.88)',
      headerSortActiveBg: '#f0f0f0',
      bodyBg: '#ffffff',
      rowHoverBg: '#fafafa',
      rowSelectedBg: '#e6f7ff',
      borderColor: '#f0f0f0',
      headerSplitColor: 'rgba(0, 0, 0, 0.06)',
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
      cellFontSize: 14,
    },
    
    // Input
    Input: {
      colorBgContainer: '#ffffff',
      colorBorder: '#d9d9d9',
      colorError: '#ff4d4f',
      colorErrorBorder: '#ff4d4f',
      colorErrorHover: '#ff7875',
      colorFocusBorder: '#4096ff',
      colorHover: '#4096ff',
      colorPlaceholder: 'rgba(0, 0, 0, 0.25)',
      activeShadow: '0 0 0 2px rgba(5, 145, 255, 0.1)',
    },
    
    // Modal
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#ffffff',
      titleColor: 'rgba(0, 0, 0, 0.88)',
      titleFontSize: 16,
      padding: 24,
      paddingMD: 16,
      borderRadius: 8,
      footerBg: 'transparent',
    },
    
    // Dropdown
    Dropdown: {
      menuBg: '#ffffff',
      menuItemBg: 'transparent',
      menuItemSelectedBg: '#f5f5f5',
      menuItemHoverBg: 'rgba(0, 0, 0, 0.04)',
      menuItemSelectedColor: 'rgba(0, 0, 0, 0.88)',
      menuItemColor: 'rgba(0, 0, 0, 0.88)',
      paddingBlock: 6,
      paddingInline: 12,
    },
    
    // Typography
    Typography: {
      titleMarginTop: '1.2em',
      titleMarginBottom: '0.5em',
      fontWeightStrong: 600,
      colorTextHeading: 'rgba(0, 0, 0, 0.88)',
      colorText: 'rgba(0, 0, 0, 0.88)',
      colorTextSecondary: 'rgba(0, 0, 0, 0.45)',
    },
    
    // Tabs
    Tabs: {
      cardBg: '#fafafa',
      cardGutter: 2,
      cardHeight: 40,
      horizontalItemGutter: 32,
      horizontalItemPadding: '12px 0',
      inkBarColor: '#1677ff',
      itemColor: 'rgba(0, 0, 0, 0.88)',
      itemSelectedColor: '#1677ff',
      itemHoverColor: '#1677ff',
    }
  }
};

export default theme;