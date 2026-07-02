import React, { useState } from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from '@mui/material/styles';



const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '3px',
  cursor: 'pointer',
  width: 16,
  height: 16,
  border: 'solid #767676 1px',

}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "var(--primary)",
});


export default function Checkboxes({ data, onCheckboxChange, preSelected = [], }) {
  

  // children selection state
  // const [checked, setChecked] = useState({});
  const [selectedClades, setSelectedClades] =
  useState(() => {
    const initial = {};

    preSelected.forEach((item) => {
      initial[item.parent] = item.children || [];
    });

    return initial;
  });

  const [expanded, setExpanded] =
    useState(() => {
      const initial = {};

      preSelected.forEach((item) => {
        initial[item.parent] = true;
      });

      return initial;
  });

  // Toggle parent = expand/collapse only
  const handleParentChange = (parent, isOpen) => {
    setExpanded((prev) => ({
      ...prev,
      [parent.name]: isOpen,
    }));

    setSelectedClades((prev) => {
      const updated = { ...prev };

      if (isOpen) {
        // add parent with empty children
        if (!updated[parent.name]) {
          updated[parent.name] = [];
        }
      } else {
        // remove parent completely
        delete updated[parent.name];
      }

      const payload = Object.entries(updated).map(
        ([parentName, children]) => ({
          parent: parentName,
          children,
        })
      );

      onCheckboxChange?.(payload);

      return updated;
    });
  };

  // Toggle child selection only
  const handleChildChange = (
    parent,
    child,
    isChecked
  ) => {
    setSelectedClades((prev) => {
      const currentChildren =
        prev[parent.name] || [];

      let updatedChildren;

      if (isChecked) {
        updatedChildren = [
          ...currentChildren,
          child.name,
        ];
      } else {
        updatedChildren =
          currentChildren.filter(
            (c) => c !== child.name
          );
      }

      const updated = {
        ...prev,
        [parent.name]: updatedChildren,
      };

      const payload = Object.entries(updated).map(
        ([parentName, children]) => ({
          parent: parentName,
          children,
        })
      );

      onCheckboxChange?.(payload);

      return updated;
    });
  };


  return (
    <Box>
      {data.map((parent) => {
        const children = parent.nodes || [];

        const isExpanded = !!expanded[parent.name];

        return (
          <Box key={parent.name}>
            {/* Parent (EXPAND ONLY) */}
            <FormControlLabel
              sx={{
                margin: 0,

                "& .MuiFormControlLabel-label": {
                  fontSize: "12px",
                },

                "& .MuiCheckbox-root": {
                  padding: "2px",
                },

                display: "flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "3px"
              }}
              label={parent.text}
              control={
                <Checkbox
                  checked={isExpanded}
                  onChange={(e) =>
                    handleParentChange(
                      parent,
                      e.target.checked
                    )
                  }
                  checkedIcon={<BpCheckedIcon />}
                  icon={<BpIcon />}
                  
                  size="small"
                />
              }
            />

            {/* Children (only when expanded) */}
            {children.length > 0 && isExpanded && (
              <Box
                sx={{
                  ml: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0px", // or 2px if you want slight spacing
                  "& .MuiFormControlLabel-root": {
                    margin: 0,
                    padding: 0,
                  },
                }}
              >
                {children.map((child) => (
                  <FormControlLabel
                    key={child.name}
                    sx={{
                      margin: 0,

                      "& .MuiFormControlLabel-label": {
                        fontSize: "12px",
                      },

                      "& .MuiCheckbox-root": {
                        padding: "2px",
                      },

                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    label={child.text}
                    control={
                      <Checkbox
                        checked={
                          selectedClades[parent.name]?.includes(
                            child.name
                          ) || false
                        }
                                                onChange={(e) =>
                                                  handleChildChange(
                          parent,
                          child,
                          e.target.checked
                        )
                        }
                              checkedIcon={<BpCheckedIcon />}
                        icon={<BpIcon />}
                        size="small"
                      />
                    }
                  />
                ))}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}