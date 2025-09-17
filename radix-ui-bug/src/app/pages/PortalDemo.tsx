"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Popover from "@radix-ui/react-popover";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import * as Toast from "@radix-ui/react-toast";

export function PortalDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  return (
    <div className="portal-demo-container" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Portal-Based Components Demo
      </h1>
      
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        This page focuses on Radix UI components that use portals (ReactDOM.createPortal).
        These components are more likely to cause hydration issues due to server/client DOM structure differences.
      </p>

      <Toast.Provider swipeDirection="right">
        <div style={{ display: "grid", gap: "3rem" }}>
          
          {/* Dialog Section */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>
              Dialog (Portal-based Modal)
            </h2>
            
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#007acc",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Open Portal Dialog
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    position: "fixed",
                    inset: 0,
                    animation: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                <Dialog.Content
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90vw",
                    maxWidth: "500px",
                    maxHeight: "85vh",
                    padding: "25px",
                    animation: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <Dialog.Title style={{ margin: 0, fontWeight: 600, fontSize: "18px", marginBottom: "15px" }}>
                    Portal Dialog Test
                  </Dialog.Title>
                  <Dialog.Description style={{ margin: "10px 0 20px", fontSize: "15px", lineHeight: 1.5, color: "#666" }}>
                    This dialog is rendered using ReactDOM.createPortal. It should maintain consistent behavior
                    between server and client rendering. Check for hydration mismatches in the console.
                  </Dialog.Description>
                  
                  <div style={{ marginTop: "25px" }}>
                    <p style={{ fontSize: "14px", marginBottom: "15px" }}>
                      Portal content is rendered outside the normal component tree, which can cause:
                    </p>
                    <ul style={{ fontSize: "14px", paddingLeft: "20px", marginBottom: "20px" }}>
                      <li>Server renders portal content inline</li>
                      <li>Client renders portal content to document.body</li>
                      <li>DOM structure mismatch during hydration</li>
                      <li>Event handler attachment issues</li>
                    </ul>
                  </div>

                  <div style={{ display: "flex", marginTop: "25px", justifyContent: "flex-end", gap: "10px" }}>
                    <Dialog.Close
                      style={{
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </Dialog.Close>
                    <Dialog.Close
                      style={{
                        backgroundColor: "#007acc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Confirm
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Uses: ReactDOM.createPortal, Focus management, Overlay positioning
            </p>
          </section>

          {/* Tooltip Section */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>
              Tooltip (Portal-based Hover)
            </h2>
            
            <Tooltip.Provider>
              <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
                <Tooltip.Root>
                  <Tooltip.Trigger
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Hover for Portal Tooltip
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      style={{
                        borderRadius: "6px",
                        padding: "12px 16px",
                        fontSize: "14px",
                        lineHeight: 1.4,
                        color: "white",
                        backgroundColor: "#333",
                        boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                        userSelect: "none",
                        animationDuration: "400ms",
                        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                        willChange: "transform, opacity",
                      }}
                      sideOffset={5}
                    >
                      This tooltip is rendered via portal and should maintain consistent positioning
                      and timing between server and client renders.
                      <Tooltip.Arrow style={{ fill: "#333" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root>
                  <Tooltip.Trigger
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Another Portal Tooltip
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      style={{
                        borderRadius: "6px",
                        padding: "12px 16px",
                        fontSize: "14px",
                        lineHeight: 1.4,
                        color: "white",
                        backgroundColor: "#dc3545",
                        boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                        userSelect: "none",
                        animationDuration: "400ms",
                        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                        willChange: "transform, opacity",
                      }}
                      sideOffset={5}
                    >
                      Multiple tooltips test portal container management and cleanup.
                      <Tooltip.Arrow style={{ fill: "#dc3545" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>
            </Tooltip.Provider>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Uses: ReactDOM.createPortal, Popper positioning, Hover state management
            </p>
          </section>

          {/* Popover Section */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>
              Popover (Portal-based Floating Content)
            </h2>
            
            <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
              <Popover.Trigger
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#6f42c1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Open Portal Popover
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  style={{
                    borderRadius: "8px",
                    padding: "20px",
                    width: "320px",
                    backgroundColor: "white",
                    boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                    border: "1px solid #e0e0e0",
                    animationDuration: "400ms",
                    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform, opacity",
                  }}
                  sideOffset={5}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                      Portal Popover Content
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5, color: "#666" }}>
                      This popover content is rendered outside the normal DOM hierarchy using a portal.
                      It should maintain proper positioning and focus management.
                    </p>
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <button
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#f0f0f0",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                        onClick={() => setPopoverOpen(false)}
                      >
                        Close
                      </button>
                      <button
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#6f42c1",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Action
                      </button>
                    </div>
                  </div>
                  <Popover.Arrow style={{ fill: "white", stroke: "#e0e0e0", strokeWidth: 1 }} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Uses: ReactDOM.createPortal, Popper positioning, Click-outside handling
            </p>
          </section>

          {/* Select Section */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>
              Select (Portal-based Dropdown)
            </h2>
            
            <Select.Root value={selectValue} onValueChange={setSelectValue}>
              <Select.Trigger
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "6px",
                  padding: "0.75rem 1rem",
                  fontSize: "14px",
                  lineHeight: 1,
                  height: "40px",
                  gap: "8px",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  minWidth: "200px",
                }}
              >
                <Select.Value placeholder="Select a portal option..." />
                <Select.Icon>
                  <span style={{ fontSize: "12px" }}>▼</span>
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  style={{
                    overflow: "hidden",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Select.ScrollUpButton
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "25px",
                      backgroundColor: "white",
                      color: "#666",
                      cursor: "default",
                    }}
                  >
                    ↑
                  </Select.ScrollUpButton>
                  <Select.Viewport style={{ padding: "5px" }}>
                    <Select.Item
                      value="portal-option-1"
                      style={{
                        fontSize: "14px",
                        lineHeight: 1,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        height: "30px",
                        padding: "0 35px 0 25px",
                        position: "relative",
                        userSelect: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Select.ItemText>Portal Option 1</Select.ItemText>
                      <Select.ItemIndicator
                        style={{
                          position: "absolute",
                          left: "0",
                          width: "25px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✓
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item
                      value="portal-option-2"
                      style={{
                        fontSize: "14px",
                        lineHeight: 1,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        height: "30px",
                        padding: "0 35px 0 25px",
                        position: "relative",
                        userSelect: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Select.ItemText>Portal Option 2</Select.ItemText>
                      <Select.ItemIndicator
                        style={{
                          position: "absolute",
                          left: "0",
                          width: "25px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✓
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item
                      value="portal-option-3"
                      style={{
                        fontSize: "14px",
                        lineHeight: 1,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        height: "30px",
                        padding: "0 35px 0 25px",
                        position: "relative",
                        userSelect: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Select.ItemText>Portal Option 3</Select.ItemText>
                      <Select.ItemIndicator
                        style={{
                          position: "absolute",
                          left: "0",
                          width: "25px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✓
                      </Select.ItemIndicator>
                    </Select.Item>
                  </Select.Viewport>
                  <Select.ScrollDownButton
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "25px",
                      backgroundColor: "white",
                      color: "#666",
                      cursor: "default",
                    }}
                  >
                    ↓
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Uses: ReactDOM.createPortal, Popper positioning, Keyboard navigation, Scroll handling
            </p>
          </section>

          {/* HoverCard Section */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>
              HoverCard (Portal-based Rich Hover)
            </h2>
            
            <HoverCard.Root>
              <HoverCard.Trigger
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Hover for Portal Card
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content
                  style={{
                    borderRadius: "8px",
                    padding: "20px",
                    width: "350px",
                    backgroundColor: "white",
                    boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                    border: "1px solid #e0e0e0",
                    animationDuration: "400ms",
                    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform, opacity",
                  }}
                  sideOffset={5}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#17a2b8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        HC
                      </div>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                          Portal HoverCard
                        </div>
                        <div style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                          Rich content component
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", lineHeight: 1.5, color: "#333" }}>
                      This hover card demonstrates portal-based rich content that appears on hover.
                      It should maintain consistent positioning and timing behavior during hydration.
                    </div>
                    <div style={{ display: "flex", gap: "15px", fontSize: "12px", color: "#666" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontWeight: "600" }}>Portal:</span>
                        <span>Yes</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontWeight: "600" }}>Positioning:</span>
                        <span>Popper</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontWeight: "600" }}>Trigger:</span>
                        <span>Hover</span>
                      </div>
                    </div>
                  </div>
                  <HoverCard.Arrow style={{ fill: "white", stroke: "#e0e0e0", strokeWidth: 1 }} />
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Uses: ReactDOM.createPortal, Popper positioning, Hover delay management
            </p>
          </section>

          {/* DropdownMenu Section */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>
              DropdownMenu (Portal-based Context Menu)
            </h2>
            
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#fd7e14",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Open Portal Menu
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  style={{
                    minWidth: "220px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "5px",
                    boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                    border: "1px solid #e0e0e0",
                    animationDuration: "400ms",
                    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform, opacity",
                  }}
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    style={{
                      fontSize: "14px",
                      lineHeight: 1,
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      height: "30px",
                      padding: "0 10px",
                      position: "relative",
                      userSelect: "none",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    Portal Menu Item 1
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    style={{
                      fontSize: "14px",
                      lineHeight: 1,
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      height: "30px",
                      padding: "0 10px",
                      position: "relative",
                      userSelect: "none",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    Portal Menu Item 2
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator
                    style={{
                      height: "1px",
                      backgroundColor: "#e0e0e0",
                      margin: "5px",
                    }}
                  />
                  <DropdownMenu.Item
                    style={{
                      fontSize: "14px",
                      lineHeight: 1,
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      height: "30px",
                      padding: "0 10px",
                      position: "relative",
                      userSelect: "none",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    Portal Menu Item 3
                  </DropdownMenu.Item>
                  <DropdownMenu.Arrow style={{ fill: "white", stroke: "#e0e0e0", strokeWidth: 1 }} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Uses: ReactDOM.createPortal, Popper positioning, Keyboard navigation, Focus management
            </p>
          </section>

          {/* Toast Section */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>
              Toast (Portal-based Notifications)
            </h2>
            
            <button
              onClick={() => setToastOpen(true)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#20c997",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Show Portal Toast
            </button>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Uses: ReactDOM.createPortal, Fixed positioning, Animation timing, Auto-dismiss
            </p>
          </section>
        </div>

        {/* Toast Implementation */}
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
            padding: "16px 20px",
            display: "grid",
            gridTemplateAreas: '"title action" "description action"',
            gridTemplateColumns: "auto max-content",
            columnGap: "15px",
            alignItems: "center",
            border: "1px solid #e0e0e0",
          }}
        >
          <Toast.Title style={{ gridArea: "title", marginBottom: "5px", fontWeight: 600, fontSize: "15px" }}>
            Portal Toast Notification
          </Toast.Title>
          <Toast.Description style={{ gridArea: "description", margin: 0, fontSize: "13px", lineHeight: 1.4, color: "#666" }}>
            This toast is rendered via portal to a fixed viewport. It should maintain consistent positioning
            and animation behavior during hydration.
          </Toast.Description>
          <Toast.Action
            style={{
              gridArea: "action",
              backgroundColor: "#20c997",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer",
            }}
            altText="Close toast notification"
          >
            Dismiss
          </Toast.Action>
        </Toast.Root>
        
        <Toast.Viewport
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: "25px",
            gap: "10px",
            width: "420px",
            maxWidth: "100vw",
            margin: 0,
            listStyle: "none",
            zIndex: 2147483647,
            outline: "none",
          }}
        />
      </Toast.Provider>
    </div>
  );
}

