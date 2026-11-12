---
title: Go package
description: Embed hm's agent in your own Go program with github.com/usehm/hm/pkg/hm/agent.
section: Automation
order: 4
---

The Go package `github.com/usehm/hm/pkg/hm/agent` runs the same agent without the window, with the same config, `guard.yaml`, skills, MCP servers, instruction files and saved sessions.

```sh
go get github.com/usehm/hm/pkg/hm/agent
```

```go
r, err := agent.New(agent.Options{Root: ".", Approver: myApprover{}})
if err != nil {
	return err
}
defer r.Close()

go func() {
	for e := range r.Events() {
		// text deltas, tool calls and results, usage, ...
	}
}()

err = r.Prompt(ctx, "list the packages") // r.Steer and r.FollowUp work meanwhile
err = r.Prompt(ctx, "what is wrong here?", agent.Image{Data: png}) // images go along
fmt.Println(r.Answer())
```

## Approvals

Your program decides approvals by implementing `Approver`. It is called on the agent's goroutine and may block, say to ask a person. Without one, calls that need approval are refused and the model is told why. `guard.yaml` deny rules are checked first and always win.

```go
type myApprover struct{}

// Allow file edits, refuse everything else the mode would ask about.
func (myApprover) Approve(ctx context.Context, req agent.Request) (agent.Decision, error) {
	return agent.Decision{Allow: req.Category == "edit"}, nil
}
```

An `Approver` that also implements `Asker` answers the agent's `ask_user` questions.

## Steering

While `Prompt` runs, `r.Steer` interrupts the batch of tool calls with a new message and `r.FollowUp` queues one for after the turn, the same as `Enter` and `Alt+Enter` in the app.
