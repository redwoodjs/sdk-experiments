"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Avatar from "@radix-ui/react-avatar";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Form from "@radix-ui/react-form";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Label from "@radix-ui/react-label";
import * as Popover from "@radix-ui/react-popover";
import * as Progress from "@radix-ui/react-progress";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import * as Tabs from "@radix-ui/react-tabs";
import * as Toast from "@radix-ui/react-toast";
import * as Toggle from "@radix-ui/react-toggle";
import * as Tooltip from "@radix-ui/react-tooltip";

export function RadixDemo() {
  // State for various components
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [togglePressed, setTogglePressed] = useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(50);
  const [sliderValue, setSliderValue] = useState([50]);
  const [radioValue, setRadioValue] = useState("option1");
  const [selectValue, setSelectValue] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  return (
    <div
      className="radix-demo-container"
      style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}
      >
        Radix UI Components Demo
      </h1>

      <p style={{ marginBottom: "2rem", color: "#666" }}>
        This page demonstrates various Radix UI components to test hydration
        behavior in RedwoodSDK. All components are client-side rendered and
        should maintain their state during hydration.
      </p>

      {/* Toast Provider - needs to wrap everything */}
      <Toast.Provider swipeDirection="right">
        <div style={{ display: "grid", gap: "3rem" }}>
          {/* Basic Form Controls Section */}
          <section>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "semibold",
                marginBottom: "1rem",
              }}
            >
              Form Controls
            </h2>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* Checkbox */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Checkbox.Root
                  checked={checkboxChecked}
                  onCheckedChange={setCheckboxChecked}
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: checkboxChecked ? "#007acc" : "white",
                  }}
                >
                  <Checkbox.Indicator>
                    <span style={{ color: "white", fontSize: "12px" }}>✓</span>
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <Label.Root style={{ fontSize: "14px" }}>
                  Accept terms and conditions
                </Label.Root>
              </div>

              {/* Switch */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Switch.Root
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                  style={{
                    width: "42px",
                    height: "24px",
                    backgroundColor: switchChecked ? "#007acc" : "#ccc",
                    borderRadius: "12px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <Switch.Thumb
                    style={{
                      display: "block",
                      width: "18px",
                      height: "18px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "3px",
                      left: switchChecked ? "21px" : "3px",
                      transition: "left 0.2s",
                    }}
                  />
                </Switch.Root>
                <Label.Root style={{ fontSize: "14px" }}>
                  Enable notifications
                </Label.Root>
              </div>

              {/* Toggle */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Toggle.Root
                  pressed={togglePressed}
                  onPressedChange={setTogglePressed}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: togglePressed ? "#007acc" : "white",
                    color: togglePressed ? "white" : "black",
                    cursor: "pointer",
                  }}
                >
                  Bold
                </Toggle.Root>
                <span style={{ fontSize: "14px" }}>Toggle text formatting</span>
              </div>
            </div>
          </section>

          {/* Progress and Slider Section */}
          <section>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "semibold",
                marginBottom: "1rem",
              }}
            >
              Progress & Sliders
            </h2>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* Progress */}
              <div>
                <Label.Root
                  style={{
                    fontSize: "14px",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Progress: {progressValue}%
                </Label.Root>
                <Progress.Root
                  value={progressValue}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "#e5e7eb",
                    borderRadius: "4px",
                    width: "300px",
                    height: "8px",
                  }}
                >
                  <Progress.Indicator
                    style={{
                      backgroundColor: "#007acc",
                      width: `${progressValue}%`,
                      height: "100%",
                      transition: "width 660ms cubic-bezier(0.65, 0, 0.35, 1)",
                    }}
                  />
                </Progress.Root>
                <button
                  onClick={() =>
                    setProgressValue(Math.min(100, progressValue + 10))
                  }
                  style={{
                    marginTop: "0.5rem",
                    marginRight: "0.5rem",
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  +10
                </button>
                <button
                  onClick={() =>
                    setProgressValue(Math.max(0, progressValue - 10))
                  }
                  style={{ padding: "0.25rem 0.5rem" }}
                >
                  -10
                </button>
              </div>

              {/* Slider */}
              <div>
                <Label.Root
                  style={{
                    fontSize: "14px",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Slider: {sliderValue[0]}
                </Label.Root>
                <Slider.Root
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    userSelect: "none",
                    touchAction: "none",
                    width: "300px",
                    height: "20px",
                  }}
                >
                  <Slider.Track
                    style={{
                      backgroundColor: "#e5e7eb",
                      position: "relative",
                      flexGrow: 1,
                      borderRadius: "4px",
                      height: "4px",
                    }}
                  >
                    <Slider.Range
                      style={{
                        position: "absolute",
                        backgroundColor: "#007acc",
                        borderRadius: "4px",
                        height: "100%",
                      }}
                    />
                  </Slider.Track>
                  <Slider.Thumb
                    style={{
                      display: "block",
                      width: "16px",
                      height: "16px",
                      backgroundColor: "white",
                      border: "2px solid #007acc",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                </Slider.Root>
              </div>
            </div>
          </section>

          {/* Selection Components */}
          <section>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "semibold",
                marginBottom: "1rem",
              }}
            >
              Selection Components
            </h2>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* Radio Group */}
              <div>
                <Label.Root
                  style={{
                    fontSize: "14px",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Choose an option:
                </Label.Root>
                <RadioGroup.Root
                  value={radioValue}
                  onValueChange={setRadioValue}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <RadioGroup.Item
                      value="option1"
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RadioGroup.Indicator
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#007acc",
                        }}
                      />
                    </RadioGroup.Item>
                    <Label.Root style={{ fontSize: "14px" }}>
                      Option 1
                    </Label.Root>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <RadioGroup.Item
                      value="option2"
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RadioGroup.Indicator
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#007acc",
                        }}
                      />
                    </RadioGroup.Item>
                    <Label.Root style={{ fontSize: "14px" }}>
                      Option 2
                    </Label.Root>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <RadioGroup.Item
                      value="option3"
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RadioGroup.Indicator
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#007acc",
                        }}
                      />
                    </RadioGroup.Item>
                    <Label.Root style={{ fontSize: "14px" }}>
                      Option 3
                    </Label.Root>
                  </div>
                </RadioGroup.Root>
              </div>

              {/* Select */}
              <div>
                <Label.Root
                  style={{
                    fontSize: "14px",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Select a fruit:
                </Label.Root>
                <Select.Root value={selectValue} onValueChange={setSelectValue}>
                  <Select.Trigger
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: "4px",
                      padding: "0.5rem 1rem",
                      fontSize: "14px",
                      lineHeight: 1,
                      height: "35px",
                      gap: "5px",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      minWidth: "160px",
                    }}
                  >
                    <Select.Value placeholder="Select a fruit..." />
                    <Select.Icon>
                      <span>▼</span>
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      style={{
                        overflow: "hidden",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        boxShadow:
                          "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
                        border: "1px solid #ccc",
                      }}
                    >
                      <Select.Viewport style={{ padding: "5px" }}>
                        <Select.Item
                          value="apple"
                          style={{
                            fontSize: "14px",
                            lineHeight: 1,
                            borderRadius: "3px",
                            display: "flex",
                            alignItems: "center",
                            height: "25px",
                            padding: "0 35px 0 25px",
                            position: "relative",
                            userSelect: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Select.ItemText>Apple</Select.ItemText>
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
                          value="banana"
                          style={{
                            fontSize: "14px",
                            lineHeight: 1,
                            borderRadius: "3px",
                            display: "flex",
                            alignItems: "center",
                            height: "25px",
                            padding: "0 35px 0 25px",
                            position: "relative",
                            userSelect: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Select.ItemText>Banana</Select.ItemText>
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
                          value="orange"
                          style={{
                            fontSize: "14px",
                            lineHeight: 1,
                            borderRadius: "3px",
                            display: "flex",
                            alignItems: "center",
                            height: "25px",
                            padding: "0 35px 0 25px",
                            position: "relative",
                            userSelect: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Select.ItemText>Orange</Select.ItemText>
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
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>
          </section>

          {/* Layout Components */}
          <section>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "semibold",
                marginBottom: "1rem",
              }}
            >
              Layout Components
            </h2>

            {/* Tabs */}
            <Tabs.Root
              defaultValue="tab1"
              style={{ width: "100%", maxWidth: "500px" }}
            >
              <Tabs.List
                style={{
                  display: "flex",
                  borderBottom: "1px solid #ccc",
                  marginBottom: "1rem",
                }}
              >
                <Tabs.Trigger
                  value="tab1"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    borderBottom: "2px solid transparent",
                  }}
                >
                  Tab 1
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="tab2"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    borderBottom: "2px solid transparent",
                  }}
                >
                  Tab 2
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="tab3"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    borderBottom: "2px solid transparent",
                  }}
                >
                  Tab 3
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1" style={{ padding: "1rem 0" }}>
                <h3>Tab 1 Content</h3>
                <p>
                  This is the content for the first tab. It should maintain its
                  state during hydration.
                </p>
              </Tabs.Content>
              <Tabs.Content value="tab2" style={{ padding: "1rem 0" }}>
                <h3>Tab 2 Content</h3>
                <p>
                  This is the content for the second tab. Test switching between
                  tabs.
                </p>
              </Tabs.Content>
              <Tabs.Content value="tab3" style={{ padding: "1rem 0" }}>
                <h3>Tab 3 Content</h3>
                <p>
                  This is the content for the third tab. All tabs should work
                  correctly.
                </p>
              </Tabs.Content>
            </Tabs.Root>

            <Separator.Root
              style={{
                backgroundColor: "#ccc",
                height: "1px",
                margin: "2rem 0",
              }}
            />

            {/* Accordion */}
            <Accordion.Root
              type="single"
              collapsible
              style={{ width: "100%", maxWidth: "500px" }}
            >
              <Accordion.Item
                value="item-1"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <Accordion.Header>
                  <Accordion.Trigger
                    style={{
                      fontFamily: "inherit",
                      backgroundColor: "transparent",
                      padding: "1rem 0",
                      height: "45px",
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "15px",
                      lineHeight: 1,
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Is it accessible?
                    <span>+</span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content
                  style={{
                    overflow: "hidden",
                    fontSize: "14px",
                    paddingBottom: "1rem",
                  }}
                >
                  <div style={{ paddingTop: "1rem" }}>
                    Yes. It adheres to the WAI-ARIA design pattern and is tested
                    with screen readers.
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item
                value="item-2"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <Accordion.Header>
                  <Accordion.Trigger
                    style={{
                      fontFamily: "inherit",
                      backgroundColor: "transparent",
                      padding: "1rem 0",
                      height: "45px",
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "15px",
                      lineHeight: 1,
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Is it unstyled?
                    <span>+</span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content
                  style={{
                    overflow: "hidden",
                    fontSize: "14px",
                    paddingBottom: "1rem",
                  }}
                >
                  <div style={{ paddingTop: "1rem" }}>
                    Yes. It's unstyled by default, giving you freedom over the
                    look and feel.
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="item-3">
                <Accordion.Header>
                  <Accordion.Trigger
                    style={{
                      fontFamily: "inherit",
                      backgroundColor: "transparent",
                      padding: "1rem 0",
                      height: "45px",
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "15px",
                      lineHeight: 1,
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Can it be animated?
                    <span>+</span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content
                  style={{
                    overflow: "hidden",
                    fontSize: "14px",
                    paddingBottom: "1rem",
                  }}
                >
                  <div style={{ paddingTop: "1rem" }}>
                    Yes! You can animate the Accordion with CSS or JavaScript
                    animation libraries.
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </section>

          {/* Interactive Components */}
          <section>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "semibold",
                marginBottom: "1rem",
              }}
            >
              Interactive Components
            </h2>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Collapsible */}
              <div>
                <Collapsible.Root
                  open={collapsibleOpen}
                  onOpenChange={setCollapsibleOpen}
                >
                  <Collapsible.Trigger
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {collapsibleOpen ? "Hide" : "Show"} Details
                  </Collapsible.Trigger>
                  <Collapsible.Content style={{ marginTop: "0.5rem" }}>
                    <div
                      style={{
                        padding: "1rem",
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #eee",
                        borderRadius: "4px",
                      }}
                    >
                      <p>This is collapsible content that can be toggled.</p>
                      <p>It should maintain its state during hydration.</p>
                    </div>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>

              {/* Dialog */}
              <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Trigger
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#007acc",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Open Dialog
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      position: "fixed",
                      inset: 0,
                    }}
                  />
                  <Dialog.Content
                    style={{
                      backgroundColor: "white",
                      borderRadius: "6px",
                      boxShadow:
                        "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "90vw",
                      maxWidth: "450px",
                      maxHeight: "85vh",
                      padding: "25px",
                    }}
                  >
                    <Dialog.Title
                      style={{ margin: 0, fontWeight: 500, fontSize: "17px" }}
                    >
                      Dialog Title
                    </Dialog.Title>
                    <Dialog.Description
                      style={{
                        margin: "10px 0 20px",
                        fontSize: "15px",
                        lineHeight: 1.5,
                      }}
                    >
                      This is a dialog component. It should render correctly and
                      maintain focus management.
                    </Dialog.Description>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "25px",
                        justifyContent: "flex-end",
                      }}
                    >
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
                        Close
                      </Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              {/* Alert Dialog */}
              <AlertDialog.Root
                open={alertDialogOpen}
                onOpenChange={setAlertDialogOpen}
              >
                <AlertDialog.Trigger
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete Item
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      position: "fixed",
                      inset: 0,
                    }}
                  />
                  <AlertDialog.Content
                    style={{
                      backgroundColor: "white",
                      borderRadius: "6px",
                      boxShadow:
                        "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "90vw",
                      maxWidth: "500px",
                      maxHeight: "85vh",
                      padding: "25px",
                    }}
                  >
                    <AlertDialog.Title
                      style={{ margin: 0, fontWeight: 500, fontSize: "17px" }}
                    >
                      Are you absolutely sure?
                    </AlertDialog.Title>
                    <AlertDialog.Description
                      style={{
                        margin: "10px 0 20px",
                        fontSize: "15px",
                        lineHeight: 1.5,
                      }}
                    >
                      This action cannot be undone. This will permanently delete
                      the item.
                    </AlertDialog.Description>
                    <div
                      style={{
                        display: "flex",
                        gap: "25px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <AlertDialog.Cancel
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </AlertDialog.Cancel>
                      <AlertDialog.Action
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                        }}
                      >
                        Yes, delete
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>

              {/* Toast Trigger */}
              <button
                onClick={() => setToastOpen(true)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Show Toast
              </button>
            </div>
          </section>

          {/* Tooltip and Avatar Section */}
          <section>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "semibold",
                marginBottom: "1rem",
              }}
            >
              Additional Components
            </h2>

            <div
              style={{
                display: "flex",
                gap: "2rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Avatar */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Avatar.Root
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    verticalAlign: "middle",
                    overflow: "hidden",
                    userSelect: "none",
                    width: "45px",
                    height: "45px",
                    borderRadius: "100%",
                    backgroundColor: "#007acc",
                  }}
                >
                  <Avatar.Image
                    src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                    alt="User Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "inherit",
                    }}
                  />
                  <Avatar.Fallback
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                      color: "#007acc",
                      fontSize: "15px",
                      lineHeight: 1,
                      fontWeight: 500,
                    }}
                  >
                    JD
                  </Avatar.Fallback>
                </Avatar.Root>
                <span style={{ fontSize: "14px" }}>User Avatar</span>
              </div>

              {/* Tooltip */}
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Hover for tooltip
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      style={{
                        borderRadius: "4px",
                        padding: "10px 15px",
                        fontSize: "15px",
                        lineHeight: 1,
                        color: "white",
                        backgroundColor: "#333",
                        boxShadow:
                          "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                      }}
                      sideOffset={5}
                    >
                      This is a tooltip with helpful information.
                      <Tooltip.Arrow style={{ fill: "#333" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>

              {/* Hover Card */}
              <HoverCard.Root>
                <HoverCard.Trigger
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Hover Card
                </HoverCard.Trigger>
                <HoverCard.Portal>
                  <HoverCard.Content
                    style={{
                      borderRadius: "6px",
                      padding: "20px",
                      width: "300px",
                      backgroundColor: "white",
                      boxShadow:
                        "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
                      border: "1px solid #ccc",
                    }}
                    sideOffset={5}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "15px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "15px",
                              lineHeight: 1.5,
                              fontWeight: 500,
                            }}
                          >
                            Hover Card Title
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              lineHeight: 1.5,
                              color: "#666",
                            }}
                          >
                            This is a hover card with additional information
                            that appears on hover.
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "15px" }}>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: 1.5,
                                fontWeight: 500,
                              }}
                            >
                              0
                            </div>
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: 1.5,
                                color: "#666",
                              }}
                            >
                              Following
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: 1.5,
                                fontWeight: 500,
                              }}
                            >
                              2,900
                            </div>
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: 1.5,
                                color: "#666",
                              }}
                            >
                              Followers
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <HoverCard.Arrow style={{ fill: "white" }} />
                  </HoverCard.Content>
                </HoverCard.Portal>
              </HoverCard.Root>
            </div>
          </section>
        </div>

        {/* Toast */}
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            boxShadow:
              "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
            padding: "15px",
            display: "grid",
            gridTemplateAreas: '"title action" "description action"',
            gridTemplateColumns: "auto max-content",
            columnGap: "15px",
            alignItems: "center",
            border: "1px solid #ccc",
          }}
        >
          <Toast.Title
            style={{
              gridArea: "title",
              marginBottom: "5px",
              fontWeight: 500,
              fontSize: "15px",
            }}
          >
            Toast Notification
          </Toast.Title>
          <Toast.Description
            style={{
              gridArea: "description",
              margin: 0,
              fontSize: "13px",
              lineHeight: 1.3,
            }}
          >
            This is a toast notification that appears when triggered.
          </Toast.Description>
          <Toast.Action
            style={{
              gridArea: "action",
              backgroundColor: "#007acc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0.25rem 0.5rem",
              fontSize: "12px",
              cursor: "pointer",
            }}
            altText="Close toast"
          >
            Close
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
            width: "390px",
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
